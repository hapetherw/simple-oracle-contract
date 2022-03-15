import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { save } from "../utils/utils"
import { parseUnits } from 'ethers/lib/utils'

dotenv.config();
const min_temp = '-50';
const max_temp = '70';

async function main() {
  const factory = await ethers.getContractFactory("OracleContract");
  let contract = await factory.deploy(
      process.env.VALIDATOR_COUNT,
      parseUnits(min_temp, 2),
      parseUnits(max_temp, 2)
      );
  await contract.deployed();

  await save('oracle', {
    address: contract.address
  });

  console.log(contract.address);
  console.log(contract.deployTransaction.hash);
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });