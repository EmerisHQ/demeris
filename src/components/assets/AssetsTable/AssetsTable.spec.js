import { mount } from '@vue/test-utils';

import AssetsTable from './AssetsTable.vue';

describe('Assets Table', () => {
  test('should render correct amount', () => {
    const wrapper = mount(AssetsTable, {
      props: {
        balances: [
          {
            amount: 10,
            address: 'cosmos1eduu6rk03m7tqthj4weuvwqmwjxmh52wy0nxg3',
            base_denom: 'ATOM',
            on_chain: 'cosmos',
          },
          {
            amount: 50,
            address: 'cosmos1eduu6rk03m7tqthj4weuvwqmwjxmh52wy0nxg3',
            base_denom: 'ATOM',
            on_chain: 'akash',
          },
          {
            amount: 120,
            address: 'cosmos13hvstpm3k9wsa9esf4lvz5fl9svuzjf6vc8vvt',
            base_denom: 'KAVA',
            on_chain: 'kava',
          },
        ],
      },
    });

    const rows = wrapper.findAll('.assets-table__row');
    expect(rows).toHaveLength(2);

    expect(rows[0].find('.assets-table__row__asset').text()).toBe('ATOM');
    expect(rows[0].find('.assets-table__row__balance').text()).toBe('60 ATOM');

    expect(rows[1].find('.assets-table__row__asset').text()).toBe('KAVA');
    expect(rows[1].find('.assets-table__row__balance').text()).toBe('120 KAVA');
  });

  it('should emit click event', () => {
    const wrapper = mount(AssetsTable, {
      props: {
        balances: [
          {
            amount: 10,
            address: 'cosmos1eduu6rk03m7tqthj4weuvwqmwjxmh52wy0nxg3',
            base_denom: 'ATOM',
            on_chain: 'cosmos',
          },
        ],
      },
    });

    const rows = wrapper.findAll('.assets-table__row');
    expect(rows).toHaveLength(1);

    const button = rows[0].find('.assets-table__row__arrow-button');
    button.trigger('click');

    expect(wrapper.emitted()['row-click']).toEqual([[{ chainsNames: ['cosmos'], denom: 'ATOM', totalAmount: 10 }]]);
  });
});
