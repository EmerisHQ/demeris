import { TEST_DATA } from '@/TEST_DATA';
import { Balance } from '@/types/api';

export default function useAccount() {
  // @ts-ignore
  const balances: Balance[] = TEST_DATA.balances;

  return { balances };
}
