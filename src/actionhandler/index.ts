import { GlobalDemerisGetterTypes, RootStoreType } from '@/store';
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

export async function actionHandler(action: Actions.Any): Promise<Array<Actions.Step>> {
  const libStore = useStore();
  const store = libStore as RootStoreType;

  const steps = [];
  try {
    let params;
    switch (action.name) {
      case 'redeem':
        params = (action as Actions.RedeemAction).params;
        params.forEach(async (denom) => {
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
        params = (action as Actions.MoveAction).params;
        const moveStep = await move({
          amount: {
            amount: params.from.amount.amount,
            denom: params.from.amount.denom,
          },
          chain_name: params.from.chain_name,
          destination_chain_name: params.to.chain_name,
        });

        steps.push({
          name: 'transfer',
          description: 'Assets Moved',
          memo: action.memo,
          transactions: [...moveStep.steps],
        }); //TODO

        break;
      case 'transfer':
        params = (action as Actions.TransferAction).params;

        const transferStep = await transfer({
          amount: {
            amount: params.from.amount.amount,
            denom: params.from.amount.denom,
          },
          to_address: params.to.address,
          chain_name: params.from.chain_name,
          destination_chain_name: params.to.chain_name,
        });

        steps.push({
          name: 'transfer',
          description: 'Assets Transferred',
          memo: action.memo,
          transactions: [...transferStep.steps],
        }); //TODO
        break;
      case 'memo-transfer':
        params = (action as Actions.MemoTransferAction).params;

        const memoTransferStep = await memoTransfer({
          amount: {
            amount: params.from.amount.amount,
            denom: params.from.amount.denom,
          },
          to_address: params.to.address,
          chain_name: params.from.chain_name,
          destination_chain_name: params.to.chain_name,
        });

        steps.push({
          name: 'transfer',
          description: 'Assets Transferred',
          memo: action.memo,
          transactions: [...memoTransferStep.steps],
        }); //TODO
        break;
      case 'swap':
        params = (action as Actions.SwapAction).params;

        const swapFeeRate = store.getters['tendermint.liquidity.v1beta1/getParams']().params.swap_fee_rate;
        const swapFee = {
          amount: Math.ceil((parseInt(params.from.amount.amount) * parseFloat(swapFeeRate)) / 2) + '',
          denom: params.from.amount.denom,
        };
        const transferToHubStep = await move({
          amount: {
            amount: '' + (parseInt(params.from.amount.amount) + parseInt(swapFee.amount)),
            denom: params.from.amount.denom,
          },
          chain_name: params.from.chain_name,
          destination_chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
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
            amount: params.from.amount.amount,
            denom: transferToHubStep.output.amount.denom,
          },
          to: {
            amount: params.to.amount.amount,
            denom: params.to.amount.denom,
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
        params = (action as Actions.CreatePoolAction).params;
        const transferCoinAtoHubCreate = await move({
          amount: {
            amount: params.coinA.amount.amount,
            denom: params.coinA.amount.denom,
          },
          chain_name: params.coinA.chain_name,
          destination_chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
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
            amount: params.coinB.amount.amount,
            denom: params.coinB.amount.denom,
          },
          chain_name: params.coinB.chain_name,
          destination_chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
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
          coinA: transferCoinAtoHubCreate.output.amount,
          coinB: transferCoinBtoHubCreate.output.amount,
        });
        steps.push({
          name: 'createpool',
          description: 'Creating Pool', //TODO
          memo: action.memo,
          transactions: [...createPoolStep.steps],
        });
        break;
      case 'addliquidity':
        params = (action as Actions.AddLiquidityAction).params;
        const transferCoinAtoHub = await move({
          amount: {
            amount: params.coinA.amount.amount,
            denom: params.coinA.amount.denom,
          },
          chain_name: params.coinA.chain_name,
          destination_chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
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
            amount: params.coinB.amount.amount,
            denom: params.coinB.amount.denom,
          },
          chain_name: params.coinB.chain_name,
          destination_chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
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
          pool_id: params.pool_id,
          coinA: transferCoinAtoHub.output.amount,
          coinB: transferCoinBtoHub.output.amount,
        });
        steps.push({
          name: 'addliquidity',
          description: 'Adding Liquidity', //TODO
          memo: action.memo,
          transactions: [...addLiquidityStep.steps],
        });
        break;
      case 'withdrawliquidity':
        params = (action as Actions.WithdrawLiquidityAction).params;
        const transferPoolCointoHub = await move({
          amount: {
            amount: params.poolCoin.amount.amount,
            denom: params.poolCoin.amount.denom,
          },
          chain_name: params.poolCoin.chain_name,
          destination_chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
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
          pool_id: params.pool_id,
          poolCoin: transferPoolCointoHub.output.amount,
        });
        steps.push({
          name: 'withdrawliquidity',
          description: 'Withdrawing liquidity', //TODO
          memo: action.memo,
          transactions: [...withdrawLiquidityStep.steps],
        });
        break;
      case 'claim':
        params = (action as Actions.ClaimRewardsAction).params;
        steps.push({
          name: 'claim',
          description: 'claim rewards',
          memo: '',
          transactions: [{ name: 'claim', status: 'pending', data: params }],
        });
        break;
      case 'unstake':
        params = (action as Actions.UnstakeAction).params;
        steps.push({
          name: 'unstake',
          description: 'Unstake',
          memo: '',
          transactions: [
            {
              name: 'unstake',
              status: 'pending',
              data: {
                validatorAddress: params.validatorAddress,
                amount: { amount: params.amount.amount.amount, denom: params.amount.amount.denom },
                chain_name: params.amount.chain_name,
              },
            },
          ],
        });
        break;
      case 'switch':
        params = (action as Actions.RestakeAction).params;
        steps.push({
          name: 'switch',
          description: 'Restake',
          memo: '',
          transactions: [
            {
              name: 'switch',
              status: 'pending',
              data: {
                validatorSrcAddress: params.validatorSrcAddress,
                validatorDstAddress: params.validatorDstAddress,
                amount: {
                  amount: (params as Actions.RestakeParams).amount.amount.amount,
                  denom: params.amount.amount.denom,
                },
                chain_name: params.amount.chain_name,
              },
            },
          ],
        });
        break;
      case 'stake':
        params = (action as Actions.StakeAction).params;
        const transferStakingCoinToNative = await move({
          amount: {
            amount: params.amount.amount.amount,
            denom: params.amount.amount.denom,
          },
          chain_name: params.amount.chain_name,
          destination_chain_name: await getNativeChain(params.amount.amount.denom, params.amount.chain_name),
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
          validatorAddress: params.validatorAddress,
          amount: transferStakingCoinToNative.output.amount,
        });
        steps.push({
          name: 'stake',
          description: 'Staking', //TODO
          memo: '',
          transactions: [...stakingStep.steps],
        });
        break;
      case 'multistake':
        const mdparams = (action as Actions.MultiStakeAction).params;
        let allsteps: Actions.Step[] = [];
        for (let i = 0; i < mdparams.length; i++) {
          const mdsteps = await actionHandler({ name: 'stake', memo: action.memo, params: mdparams[i] });

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
              name: 'stake',
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
