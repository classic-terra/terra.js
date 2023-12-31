import { JSONSerializable } from '../../../util/json';
import { AccAddress } from '../../bech32';
import { Any } from '@terra-money/terra.proto/google/protobuf/any';
import { UpdateAdminProposal as UpdateAdminProposal_pb } from '@terra-money/terra.proto/cosmwasm/wasm/v1/proposal';

/** UpdateAdminProposal gov proposal content type to set an admin for a contract. */
export class UpdateAdminProposal extends JSONSerializable<
  UpdateAdminProposal.Amino,
  UpdateAdminProposal.Data,
  UpdateAdminProposal.Proto
> {
  /**
   * @param title a short summary
   * @param description a human readable text
   * @param contract the address of the smart contract
   * @param new_admin address to be set
   */
  constructor(
    public title: string,
    public description: string,
    public contract: AccAddress,
    public new_admin: AccAddress
  ) {
    super();
  }

  public static fromAmino(
    data: UpdateAdminProposal.Amino,
    _?: boolean
  ): UpdateAdminProposal {
    const {
      value: { title, description, contract, new_admin },
    } = data as UpdateAdminProposal.Amino;
    return new UpdateAdminProposal(title, description, contract, new_admin);
  }

  public toAmino(_?: boolean): UpdateAdminProposal.Amino {
    const { title, description, contract, new_admin } = this;
    return {
      type: 'wasm/UpdateAdminProposal',
      value: {
        title,
        description,
        contract,
        new_admin,
      },
    };
  }

  public static fromProto(
    proto: UpdateAdminProposal.Proto,
    _?: boolean
  ): UpdateAdminProposal {
    return new UpdateAdminProposal(
      proto.title,
      proto.description,
      proto.contract,
      proto.newAdmin
    );
  }

  public toProto(_?: boolean): UpdateAdminProposal.Proto {
    const { title, description, contract, new_admin } = this;
    return UpdateAdminProposal_pb.fromPartial({
      title,
      description,
      contract,
      newAdmin: new_admin,
    });
  }
  public packAny(isClassic?: boolean): Any {
    return Any.fromPartial({
      typeUrl: '/cosmwasm.wasm.v1.UpdateAdminProposal',
      value: UpdateAdminProposal_pb.encode(this.toProto(isClassic)).finish(),
    });
  }

  public static unpackAny(
    msgAny: Any,
    isClassic?: boolean
  ): UpdateAdminProposal {
    return UpdateAdminProposal.fromProto(
      UpdateAdminProposal_pb.decode(msgAny.value),
      isClassic
    );
  }

  public static fromData(
    data: UpdateAdminProposal.Data,
    _?: boolean
  ): UpdateAdminProposal {
    const { title, description, contract, new_admin } =
      data as UpdateAdminProposal.Data;
    return new UpdateAdminProposal(title, description, contract, new_admin);
  }

  public toData(_?: boolean): UpdateAdminProposal.Data {
    const { title, description, contract, new_admin } = this;
    return {
      '@type': '/cosmwasm.wasm.v1.UpdateAdminProposal',
      title,
      description,
      contract,
      new_admin,
    };
  }
}

export namespace UpdateAdminProposal {
  export interface Amino {
    type: 'wasm/UpdateAdminProposal';
    value: {
      title: string;
      description: string;
      contract: AccAddress;
      new_admin: AccAddress;
    };
  }

  export interface Data {
    '@type': '/cosmwasm.wasm.v1.UpdateAdminProposal';
    title: string;
    description: string;
    contract: AccAddress;
    new_admin: AccAddress;
  }

  export type Proto = UpdateAdminProposal_pb;
}
