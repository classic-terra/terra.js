import {
  MsgStoreCode,
  MsgInstantiateContract,
  MsgExecuteContract,
  isTxError,
  LocalTerra,
  getCodeId,
  getContractAddress,
} from '../src';
import { AccessConfig, AccessType } from '../src/core/wasm/AccessConfig';
import * as fs from 'fs';

const isClassic = false;
const client = new LocalTerra(isClassic);

// test1 key from localterra accounts
const { test1 } = client.wallets;

async function main(): Promise<void> {
  const storeCode = new MsgStoreCode(
    test1.key.accAddress,
    fs.readFileSync(isClassic ? 'contract.wasm.7' : 'contract.wasm.8').toString('base64'),
    isClassic ? undefined : new AccessConfig(AccessType.ACCESS_TYPE_EVERYBODY, "")
  );
  const storeCodeTx = await test1.createAndSignTx({
    msgs: [storeCode],
  });
  const storeCodeTxResult = await client.tx.broadcastBlock(storeCodeTx);

  console.log(storeCodeTxResult);

  if (isTxError(storeCodeTxResult)) {
    throw new Error(
      `store code failed. code: ${storeCodeTxResult.code}, codespace: ${storeCodeTxResult.codespace}, raw_log: ${storeCodeTxResult.raw_log}`
    );
  }

  const codeId = getCodeId(storeCodeTxResult);

  const instantiate = new MsgInstantiateContract(
    test1.key.accAddress,
    undefined,
    +codeId, // code ID
    { count: 0, }, // InitMsg
    { uluna: 1000000 }, // init coins
    "testlabel",
  );

  const instantiateTx = await test1.createAndSignTx({
    msgs: [instantiate],
  });
  const instantiateTxResult = await client.tx.broadcastBlock(instantiateTx);

  console.log(instantiateTxResult);

  if (isTxError(instantiateTxResult)) {
    throw new Error(
      `instantiate failed. code: ${instantiateTxResult.code}, codespace: ${instantiateTxResult.codespace}, raw_log: ${instantiateTxResult.raw_log}`
    );
  }

  const contractAddress = getContractAddress(instantiateTxResult, 0, isClassic);

  const execute = new MsgExecuteContract(
    test1.key.accAddress, // sender
    contractAddress, // contract address
    { increment: {} }, // handle msg
    { uluna: 100000 } // coins
  );
  const executeTx = await test1.createAndSignTx({
    msgs: [execute],
  });
  const executeTxResult = await client.tx.broadcastBlock(executeTx);
  console.log(executeTxResult);

  console.log(await client.wasm.contractQuery(contractAddress, { "get_count": {} }));

  const [history, _] = await client.wasm.contractHistory(contractAddress);
  console.log(history.map(h => h.toData()));
  console.log(JSON.stringify(await client.wasm.contractInfo(contractAddress)));
  console.log(JSON.stringify(await client.wasm.codeInfo(+codeId)));

}

main().then(console.log).catch(console.log)
