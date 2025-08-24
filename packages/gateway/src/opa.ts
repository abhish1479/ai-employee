import axios from "axios";
const OPA_URL = process.env.OPA_URL || "http://opa:8181/v1/data/policy/allow";

export async function opaAllow(input: any): Promise<boolean> {
  const { data } = await axios.post(OPA_URL, { input });
  return data.result === true;
}
