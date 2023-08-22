import {
  LCDClient,
  MsgSend,
  CreateTxOptions,
} from '../src';

async function main() {
  const client = new LCDClient({
    chainID: 'localterra',
    URL: 'http://localhost:1317',
  });

  const accountInfo = await client.auth.accountInfo(
    'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
  );

  const msgs = [
    new MsgSend(
      'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
      'terra1zsky63r58vc7dfn3ljj32ch6fyn4e5qd8skzyz',
      { uluna: 1234500 },
    ),
  ];

  const memo = 'estimate fee';
  const txOptions: CreateTxOptions = {
    msgs,
    memo,
    gasAdjustment: 1.75,
  };
  // Test raw estimate fee function with specified gas
  const rawFee = await client.tx.estimateFee(
    [
      {
        sequenceNumber: accountInfo.getSequenceNumber(),
        publicKey: accountInfo.getPublicKey(),
      },
    ],
    txOptions
  );

  console.log('Fee', rawFee.toData());
}

main().catch(console.error);
