import { LCDClient, MsgSend, MnemonicKey, Fee } from '../src';

async function main() {
  // create a key out of a mnemonic
  const mk = new MnemonicKey({
    mnemonic:
      'notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius',
  });

  const client = new LCDClient({
    chainID: 'localterra',
    URL: 'http://localhost:1317',
    isClassic: !!process.env.TERRA_IS_CLASSIC,
  });

  // a wallet can be created out of any key
  // wallets abstract transaction building
  const wallet = client.wallet(mk);

  // create a simple message that moves coin balances
  const send = new MsgSend(
    'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
    'terra17lmam6zguazs5q5u6z5mmx76uj63gldnse2pdp',
    { uluna: 1000000 }
  );

  await wallet
    .createAndSignTx({
      msgs: [send],
      memo: 'test from terra.js!',
    })
    .then(tx => {
      console.log(JSON.stringify(tx, null, 2));
      return client.tx.broadcast(tx);
    })
    .then(result => {
      console.log(result);
    });
}

main().catch(console.error);
