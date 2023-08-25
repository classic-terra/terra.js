import { LCDClient, MsgSwap, Coin, MnemonicKey } from '../src';

async function main() {
  const mk = new MnemonicKey({
    mnemonic:
      'notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius',
  });

  const client = new LCDClient({
    chainID: 'localterra',
    URL: 'http://localhost:1317',
    isClassic: !!process.env.TERRA_IS_CLASSIC,
  });

  const wallet = client.wallet(mk);
  const msg = new MsgSwap(
    'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
    new Coin('uluna', 1_000_000_000),
    'uusd'
  );

  await wallet
    .createAndSignTx({
      msgs: [msg],
      memo: 'swap from terra.js!',
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
