/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import * as Actions from '@/types/actions';
import { getNativeChain } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

import { addLiquidity } from './actions/addLiquidity';
import { createPool } from './actions/createPool';
import { memoTransfer } from './actions/memoTransfer';
import { move } from './actions/move';
import { redeem } from './actions/redeem';
import { stake } from './actions/stake';
import { swap } from './actions/swap';
import { transfer } from './actions/transfer';
import { withdrawLiquidity } from './actions/withdrawLiquidity';

export async function actionHandler(action: Actions.UserAction): Promise<Array<Actions.Step>> {
  const store = useStore();
  const typedstore = store as RootStoreTyped;

  const steps = [];
  try {
    switch (action.name) {
      case 'redeem':
        action.params.forEach(async (denom) => {
          const redeemStep = await redeem(denom);
          steps.push({
            name: 'redeem',
            memo: action.memo,
            description: 'Redeeming Assets',
            output: redeemStep.output,
            transactions: [...redeemStep.steps],
          }); //TODO
        });
        break;
      case 'move':
        const moveStep = await move({
          amount: {
            amount: action.params.from.amount,
            denom: action.params.from.denom,
          },
          chain_name: action.params.from.chain_name,
          destination_chain_name: action.params.to.chain_name,
        });

        steps.push({
          name: 'transfer',
          description: 'Assets Moved',
          memo: action.memo,
          transactions: [...moveStep.steps],
        }); //TODO

        break;
      case 'transfer':
        const transferStep = await transfer({
          amount: {
            amount: action.params.from.amount,
            denom: action.params.from.denom,
          },
          to_address: action.params.to.address,
          chain_name: action.params.from.chain_name,
          destination_chain_name: action.params.to.chain_name,
        });

        steps.push({
          name: 'transfer',
          description: 'Assets Transferred',
          memo: action.memo,
          transactions: [...transferStep.steps],
        }); //TODO
        break;
      case 'memo-transfer':
        const memoTransferStep = await memoTransfer({
          amount: {
            amount: action.params.from.amount,
            denom: action.params.from.denom,
          },
          to_address: action.params.to.address,
          chain_name: action.params.from.chain_name,
          destination_chain_name: action.params.to.chain_name,
        });

        steps.push({
          name: 'transfer',
          description: 'Assets Transferred',
          memo: action.memo,
          transactions: [...memoTransferStep.steps],
        }); //TODO
        break;
      case 'swap':
        const swapFeeRate = typedstore.getters['tendermint.liquidity.v1beta1/getParams']().params.swap_fee_rate;
        const swapFee = {
          amount: Math.ceil((parseInt(action.params.from.amount) * parseFloat(swapFeeRate)) / 2) + '',
          denom: action.params.from.denom,
        };
        const transferToHubStep = await move({
          amount: {
            amount: '' + (parseInt(action.params.from.amount) + parseInt(swapFee.amount)),
            denom: action.params.from.denom,
          },
          chain_name: action.params.from.chain_name,
          destination_chain_name: typedstore.getters[GlobalGetterTypes.API.getDexChain],
        });
        if (transferToHubStep.steps.length > 0) {
          steps.push({
            name: 'transfer',
            description: 'Assets must be transferred to hub first', //TODO
            memo: action.memo,
            transactions: [...transferToHubStep.steps],
          });
        }
        const swapStep = await swap({
          from: {
            amount: action.params.from.amount,
            denom: transferToHubStep.output.denom,
          },
          to: {
            amount: action.params.to.amount,
            denom: action.params.to.denom,
          },
        });
        steps.push({
          name: 'swap',
          description: 'Assets Swapped',
          memo: action.memo,
          transactions: [...swapStep.steps],
        }); //TODO
        break;
      case 'createpool':
        const transferCoinAtoHubCreate = await move({
          amount: {
            amount: action.params.coinA.amount,
            denom: action.params.coinA.denom,
          },
          chain_name: action.params.coinA.chain_name,
          destination_chain_name: typedstore.getters[GlobalGetterTypes.API.getDexChain],
        });

        if (transferCoinAtoHubCreate.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'AssetA must be transferred to hub', //TODO
            memo: action.memo,
            transactions: [...transferCoinAtoHubCreate.steps],
          });
        }

        const transferCoinBtoHubCreate = await move({
          amount: {
            amount: action.params.coinB.amount,
            denom: action.params.coinB.denom,
          },
          chain_name: action.params.coinB.chain_name,
          destination_chain_name: typedstore.getters[GlobalGetterTypes.API.getDexChain],
        });

        if (transferCoinBtoHubCreate.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'AssetB must be transferred to hub', //TODO
            memo: action.memo,
            transactions: [...transferCoinBtoHubCreate.steps],
          });
        }

        const createPoolStep = await createPool({
          coinA: { amount: transferCoinAtoHubCreate.output.amount, denom: transferCoinAtoHubCreate.output.denom },
          coinB: { amount: transferCoinBtoHubCreate.output.amount, denom: transferCoinBtoHubCreate.output.denom },
        });
        steps.push({
          name: 'createpool',
          description: 'Creating Pool', //TODO
          memo: action.memo,
          transactions: [...createPoolStep.steps],
        });
        break;
      case 'addliquidity':
        const transferCoinAtoHub = await move({
          amount: {
            amount: action.params.coinA.amount,
            denom: action.params.coinA.denom,
          },
          chain_name: action.params.coinA.chain_name,
          destination_chain_name: typedstore.getters[GlobalGetterTypes.API.getDexChain],
        });

        if (transferCoinAtoHub.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'AssetA must be transferred to hub', //TODO
            memo: action.memo,
            transactions: [...transferCoinAtoHub.steps],
          });
        }

        const transferCoinBtoHub = await move({
          amount: {
            amount: action.params.coinB.amount,
            denom: action.params.coinB.denom,
          },
          chain_name: action.params.coinB.chain_name,
          destination_chain_name: typedstore.getters[GlobalGetterTypes.API.getDexChain],
        });

        if (transferCoinBtoHub.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'AssetB must be transferred to hub', //TODO
            memo: action.memo,
            transactions: [...transferCoinBtoHub.steps],
          });
        }
        const addLiquidityStep = await addLiquidity({
          pool_id: action.params.pool_id,
          coinA: { amount: transferCoinAtoHub.output.amount, denom: transferCoinAtoHub.output.denom },
          coinB: { amount: transferCoinBtoHub.output.amount, denom: transferCoinBtoHub.output.denom },
        });
        steps.push({
          name: 'addliquidity',
          description: 'Adding Liquidity', //TODO
          memo: action.memo,
          transactions: [...addLiquidityStep.steps],
        });
        break;
      case 'withdrawliquidity':
        const transferPoolCointoHub = await move({
          amount: {
            amount: action.params.poolCoin.amount,
            denom: action.params.poolCoin.denom,
          },
          chain_name: action.params.poolCoin.chain_name,
          destination_chain_name: typedstore.getters[GlobalGetterTypes.API.getDexChain],
        });
        if (transferPoolCointoHub.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'Pool token must be transferred to hub', //TODO
            memo: action.memo,
            transactions: [...transferPoolCointoHub.steps],
          });
        }
        const withdrawLiquidityStep = await withdrawLiquidity({
          pool_id: action.params.pool_id,
          poolCoin: { amount: transferPoolCointoHub.output.amount, denom: transferPoolCointoHub.output.denom },
        });
        steps.push({
          name: 'withdrawliquidity',
          description: 'Withdrawing liquidity', //TODO
          memo: action.memo,
          transactions: [...withdrawLiquidityStep.steps],
        });
        break;
      case 'claim':
        steps.push({
          name: 'claim',
          description: 'claim rewards',
          memo: '',
          transactions: [{ type: 'claim', status: 'pending', data: action.params }],
        });
        break;
      case 'reinvest':
        steps.push({
          name: 'reinvest',
          description: 'reinvest',
          memo: '',
          transactions: [{ type: 'reinvest', status: 'pending', data: action.params }],
        });
        break;
      case 'unstake':
        steps.push({
          name: 'unstake',
          description: 'Unstake',
          memo: '',
          transactions: [
            {
              type: 'unstake',
              status: 'pending',
              data: {
                validatorAddress: action.params.validatorAddress,
                amount: { amount: action.params.amount.amount, denom: action.params.amount.denom },
                chainName: action.params.amount.chain_name,
              },
            },
          ],
        });
        break;
      case 'switch':
        steps.push({
          name: 'switch',
          description: 'Restake',
          memo: '',
          transactions: [
            {
              type: 'switch',
              status: 'pending',
              data: {
                validatorSrcAddress: action.params.validatorSrcAddress,
                validatorDstAddress: action.params.validatorDstAddress,
                amount: {
                  amount: action.params.amount.amount,
                  denom: action.params.amount.denom,
                },
                chainName: action.params.amount.chain_name,
              },
            },
          ],
        });
        break;
      case 'stake':
        const transferStakingCoinToNative = await move({
          amount: {
            amount: action.params.amount.amount,
            denom: action.params.amount.denom,
          },
          chain_name: action.params.amount.chain_name,
          destination_chain_name: await getNativeChain(action.params.amount.denom, action.params.amount.chain_name),
        });
        if (transferStakingCoinToNative.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'Staking token must be transferred to native chain', //TODO
            memo: '',
            transactions: [...transferStakingCoinToNative.steps],
          });
        }

        const stakingStep = await stake({
          validatorAddress: action.params.validatorAddress,
          amount: {
            amount: transferStakingCoinToNative.output.amount,
            denom: transferStakingCoinToNative.output.denom,
          },
        });
        steps.push({
          name: 'stake',
          description: 'Staking', //TODO
          memo: '',
          transactions: [...stakingStep.steps],
        });
        break;
      case 'multistake':
        let allsteps: Actions.Step[] = [];
        for (let i = 0; i < action.params.length; i++) {
          const mdsteps = await actionHandler({ name: 'stake', memo: action.memo, params: action.params[i] });

          allsteps = [...allsteps, ...mdsteps];
        }

        const stakesteps: Actions.Step[] = [];
        for (const step of allsteps) {
          if (step.name == 'transfer') {
            steps.push(step);
          } else {
            stakesteps.push(step);
          }
        }
        steps.push({
          name: 'stake',
          description: 'Staking', //TODO
          memo: '',
          transactions: [
            {
              type: 'stake',
              status: 'pending',
              data: [
                ...stakesteps
                  .map((x) => x.transactions)
                  .flat()
                  .map((x) => x.data)
                  .flat(),
              ],
            },
          ],
        });

        break;
    }
  } catch (e) {
    throw new Error('Unable to create action steps: ' + e);
  }

  return steps;
}
