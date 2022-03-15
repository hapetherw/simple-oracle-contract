import hre from "hardhat";
import { load, save } from "../utils/utils"
import * as dotenv from "dotenv";
import { parseUnits } from 'ethers/lib/utils'
dotenv.config();

const min_temp = '-50';
const max_temp = '70';

async function main() {
    const oracleContractAddress = (await load('oracle')).address
    console.log(oracleContractAddress)
    await hre.run("verify:verify", {
        address: process.env.VALIDATOR_COUNT,
        constructorArguments: [
            10,
            parseUnits(min_temp, 2),
            parseUnits(max_temp, 2)
        ],
    });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});