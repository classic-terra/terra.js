import { LCDClient, MnemonicKey, MsgMultiSend, SignDoc, Fee } from '../src';

async function main() {
  // create a key out of a mnemonic
  const mk = new MnemonicKey({
    mnemonic:
      'notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius',
  });

  const mk2 = new MnemonicKey({
    mnemonic:
      'quality vacuum heart guard buzz spike sight swarm shove special gym robust assume sudden deposit grid alcohol choice devote leader tilt noodle tide penalty'
  });

  const client = new LCDClient({
    chainID: 'localterra',
    URL: 'http://localhost:1317',
    isClassic: true,
  });

  // create a simple message that moves coin balances
  const send = new MsgMultiSend(
    [
      new MsgMultiSend.Input('terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v', {
        uluna: 100000,
      }),
      new MsgMultiSend.Input('terra17lmam6zguazs5q5u6z5mmx76uj63gldnse2pdp', {
        uluna: 200000,
      }),
    ],
    [
      new MsgMultiSend.Output('terra1757tkx08n0cqrw7p86ny9lnxsqeth0wgp0em95', {
        uluna: 150000,
      }),
      new MsgMultiSend.Output('terra1gufrav46pnpwf03yu7xz76ylkmatsxtplrxnmc', {
        uluna: 150000,
      }),
    ]
  );

  const accInfo = await client.auth.accountInfo(mk.accAddress);
  const accInfo2 = await client.auth.accountInfo(mk2.accAddress);

  const tx = await client.tx.create(
    [
      {
        address: mk.accAddress,
        sequenceNumber: accInfo.getSequenceNumber(),
        publicKey: accInfo.getPublicKey(),
      },
      { address: mk2.accAddress,
        sequenceNumber: accInfo2.getSequenceNumber(),
        publicKey: accInfo2.getPublicKey(),
      },
    ],
    {
      msgs: [send],
      memo: 'memo',
      fee: new Fee(200000, '300uluna'),
    }
  );

  const sig1 = await mk.createSignatureAmino(
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
      accInfo2.getAccountNumber(),
      accInfo2.getSequenceNumber(),
      tx.auth_info,
      tx.body
    ),
    client.config.isClassic,
  );

  tx.appendSignatures([sig1, sig2]);
  const result = await client.tx.broadcast(tx);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
