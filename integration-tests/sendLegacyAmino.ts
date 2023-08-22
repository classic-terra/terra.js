import { LCDClient, MsgSend, MnemonicKey, Fee } from '../src';
import { SignMode } from '@classic-terra/terra.proto/cosmos/tx/signing/v1beta1/signing';

async function main() {
  // create a key out of a mnemonic
  const mk = new MnemonicKey({
    mnemonic:
      'notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius',
  });

  const client = new LCDClient({
    chainID: 'localterra',
    URL: 'http://localhost:1317',
    isClassic: true,
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

  return wallet
    .createAndSignTx({
      msgs: [send],
      memo: 'test from terra.js!',
      fee: new Fee(200000, '1000uluna'),
      signMode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
    })
    .then(tx => client.tx.broadcast(tx))
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
    })
}

main().catch(console.error);
