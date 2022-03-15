// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
/**
 * @title OracleContract
 */
contract OracleContract is Ownable, AccessControl {
    event DetectOutlier(address indexed sender, int temperature);
    event SetTemperature(string message);

    bytes32 public constant VALIDATOR = keccak256("VALIDATOR");
    uint private immutable _totalValidators;
    int private immutable _minTemp;
    int private immutable _maxTemp;
    uint private _validatorIndex;
    uint private _fairValidators;
    int private _curTemperature;
    int private _sumTempAmount;

    /**
     * @notice Set the total number of Validators, set lower and upper bound of temperature
     * @param minTemp can be either negative or positive value, should be multipied by 10**2 from the caller side for decimal places
     * @param maxTemp can be either negative or positive value, should be multipied by 10**2 from the caller side for decimal places
     */
    constructor(
        uint totalValidators,
        int minTemp,
        int maxTemp
    ) {
        _totalValidators = totalValidators;
        _minTemp = minTemp;
        _maxTemp = maxTemp;
    }

    /**
     * @dev Grant Validator role by owner.
     */
    function setValidator(address account) external onlyOwner {
        grantRole(VALIDATOR, account);
    }

    /**
     * @dev Getter for the current temperature
     */
    function getTemperature() public view returns (int) {
        return _curTemperature;
    }
    
    /**
     * @dev Only validators can set temperature.
     */
    function setTempature(int temperature) external onlyRole(VALIDATOR) {
        if (_validatorIndex >= _totalValidators) {
            _validatorIndex = 0;
            _fairValidators = 0;
        }
        _validatorIndex ++;
        if(temperature < _minTemp || temperature > _maxTemp) {
            emit DetectOutlier(msg.sender, temperature);
        } else {
            _fairValidators ++;
            _sumTempAmount = _sumTempAmount + temperature;
            if (_validatorIndex >= _totalValidators) {
                _curTemperature = _sumTempAmount * 1e18 / int(_fairValidators) / 1e18;
                if (_fairValidators == _totalValidators) {
                    emit SetTemperature("All validator values are correct");
                } else {
                    emit SetTemperature("");
                }
            }
        }
    }
}