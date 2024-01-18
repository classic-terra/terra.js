import {
  LCDClient,
  MnemonicKey,
  MsgSubmitProposal,
} from '../src';
import { CancelSoftwareUpgradeProposal } from '../src/core/upgrade/proposals'

const client = new LCDClient({
  chainID: 'localterra',
  URL: 'http://localhost:1317',
  isClassic: !!process.env.TERRA_IS_CLASSIC,
});

// LocalTerra test1 terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v
const mk = new MnemonicKey({
  mnemonic:
    'notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius',
});

const wallet = client.wallet(mk);

const prop = new CancelSoftwareUpgradeProposal("v6", "SOFTWARE UPGRADE DESC");

async function main() {
  const msg = new MsgSubmitProposal(
    prop,
    { uluna: 10000000 },
    wallet.key.accAddress
  );

  const tx = await wallet.createAndSignTx({
    msgs: [msg],
  });

  console.log(JSON.stringify(tx, null, 2));
  const result = await client.tx.broadcast(tx);
  console.log(result);
}

main().catch(console.error);
