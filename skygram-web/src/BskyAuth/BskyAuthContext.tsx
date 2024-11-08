import { Agent } from "@atproto/api";
import { createContext } from "react";
export type AuthProfile = {
  uri:string;
  cid:string;
  value:{
    $type:string;
    description?:string;
    displayName?:string;
  }

}
export type BskyAuth = {
    pdsAgent: Agent
    signOut: () => void
    refresh: () => void,
    profile: AuthProfile,
  }

export const BskyAuthContext = createContext<BskyAuth | null>(null)
