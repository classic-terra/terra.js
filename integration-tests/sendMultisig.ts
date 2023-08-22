import {
  LCDClient,
  MnemonicKey,
  SignDoc,
  LegacyAminoMultisigPublicKey,
  SimplePublicKey,
  MsgSend,
  Fee,
} from '../src';
import { MultiSignature } from '../src/core/MultiSignature';
import { SignatureV2 } from '../src/core/SignatureV2';

async function main() {
  // create a key out of a mnemonic
  const mk1 = new MnemonicKey({
    mnemonic:
      'notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius',
  });

  const mk2 = new MnemonicKey({
    mnemonic:
      'arrest word woman erupt kiss tank neck achieve diagram gadget siren rare valve replace outside angry dance possible purchase extra yellow cruise pride august',
  });

  const mk3 = new MnemonicKey({
    mnemonic:
      'shrug resist find inch narrow tumble knee fringe wide mandate angry sense grab rack fork snack family until bread lake bridge heavy goat want',
  });
  console.log(mk1.accAddress)
  console.log(mk2.accAddress)
  console.log(mk3.accAddress)

  const multisigPubkey = new LegacyAminoMultisigPublicKey(2, [
    mk1.publicKey as SimplePublicKey,
    mk2.publicKey as SimplePublicKey,
    mk3.publicKey as SimplePublicKey,
  ]);

  const client = new LCDClient({
    chainID: 'localterra',
    URL: 'http://localhost:1317',
    isClassic: true,
  });

  const address = multisigPubkey.address();
  const multisig = new MultiSignature(multisigPubkey);

  // create a simple message that moves coin balances
  const send = new MsgSend(
    address,
    'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
    { uluna: 10000 }
  );

  const accInfo = await client.auth.accountInfo(address);
  const tx = await client.tx.create(
    [
      {
        address,
        sequenceNumber: accInfo.getSequenceNumber(),
        publicKey: accInfo.getPublicKey(),
      },
    ],
    {
      msgs: [send],
      memo: 'memo',
      fee: new Fee(200000, '10uluna'),
    }
  );

  const sig1 = await mk3.createSignatureAmino(
    new SignDoc(
      client.config.chainID,
      accInfo.getAccountNumber(),
      accInfo.getSequenceNumber(),
      tx.auth_info,
      tx.body
    ),
    client.config.isClassic,
  );

  const sig2 = await mk2.createSignatureAmino(
    new SignDoc(
      client.config.chainID,
      accInfo.getAccountNumber(),
      accInfo.getSequenceNumber(),
      tx.auth_info,
      tx.body
    ),
    client.config.isClassic,
  );

  multisig.appendSignatureV2s([sig1, sig2]);
  tx.appendSignatures([
    new SignatureV2(
      multisigPubkey,
      multisig.toSignatureDescriptor(),
      accInfo.getSequenceNumber()
    ),
  ]);
  console.log(JSON.stringify(tx.toData(), null, 2));
  const result = await client.tx.broadcastBlock(tx);
  console.log(result);
}

main().catch(console.error);
