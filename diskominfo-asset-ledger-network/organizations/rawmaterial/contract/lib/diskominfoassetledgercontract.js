/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * diskominfo asset ledger blockhain network smart contract
 * Diskominfo Jabar Asset network Hyperledger Fabric
 * Author: PJ
 */
'use strict';
// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

/**
 * Define DiskominfoassetLedger smart contract by extending Fabric Contract class
 *
 */
class DiskominfoassetLedgerContract extends Contract {

    constructor() {
        // Unique namespace pcn - RawmaterialChainNetwork when multiple contracts per chaincode file
        super('org.daln.DiskominfoassetLedgerContract');
    }
    /**
     * Instantiate to set up ledger.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No default implementation for this example
        console.log('Instantiate the DiskominfoassetLedger contract');
    }

    /**
     * Create rawmaterial material
     *
     * @param {Context} ctx the transaction context
     * @param {String} material rawmaterial
     * @param {String} materialNumber for this material
     * @param {String} material name
     * @param {String} name of the material owner
    */
   async createMaterial(ctx, rawmaterial, materialNumber, materialName, ownerName) {
        console.info('============= START : createMaterial call ===========');
        let dt = new Date().toString();
        const material = {
            materialNumber,
            rawmaterial,
            materialName,
            ownerName,
            previousOwnerType: 'MATERIAL',
            currentOwnerType: 'MATERIAL',
            createDateTime: dt,
            lastUpdated: dt
        };
        await ctx.stub.putState(materialNumber, Buffer.from(JSON.stringify(material)));
        console.info('============= END : Create material ===========');
   }
   /**
     * Rawmaterial send material To Partsupplier
     *
     * @param {Context} ctx the transaction context
     * @param {String} materialNumber for this material
     * @param {String} name of the material owner
   */
   async partsupplierDistribute(ctx, materialNumber, ownerName) {
        console.info('============= START : partsupplierDistribute call ===========');
        const materialAsBytes = await ctx.stub.getState(materialNumber);
        if (!materialAsBytes || materialAsBytes.length === 0) {
            throw new Error(`${materialNumber} does not exist`);
        }
        let dt = new Date().toString();
        const strValue = Buffer.from(materialAsBytes).toString('utf8');
        let record;
        try {
            record = JSON.parse(strValue);
            if(record.currentOwnerType!=='MATERIAL') {
               throw new Error(` material - ${materialNumber} owner must be MATERIAL`);
            }
            record.previousOwnerType= record.currentOwnerType;
            record.currentOwnerType = 'PARTSUPPLIER';
            record.ownerName = ownerName;
            record.lastUpdated = dt;
        } catch (err) {
            console.log(err);
            throw new Error(`equipmet ${materialNumber} data can't be processed`);
        }
        await ctx.stub.putState(materialNumber, Buffer.from(JSON.stringify(record)));
        console.info('============= END : wolesalerDistribute  ===========');
   }
   /**
     * Partsupplier send material To Carmanufacturer
     *
     * @param {Context} ctx the transaction context
     * @param {String} materialNumber for this material
     * @param {String} name of the material owner
   */
   async carmanufacturerReceived(ctx, materialNumber, ownerName) {
        console.info('============= START : carmanufacturerReceived call ===========');
        const materialAsBytes = await ctx.stub.getState(materialNumber);
        if (!materialAsBytes || materialAsBytes.length === 0) {
            throw new Error(`${materialNumber} does not exist`);
        }
        let dt = new Date().toString();
        const strValue = Buffer.from(materialAsBytes).toString('utf8');
        let record;
        try {
            record = JSON.parse(strValue);
            //make sure owner is partsupplier
            if(record.currentOwnerType!=='PARTSUPPLIER') {
               throw new Error(` material - ${materialNumber} owner must be PARTSUPPLIER`);
            }
            record.previousOwnerType= record.currentOwnerType;
            record.currentOwnerType = 'MANUFACTURER';
            record.ownerName = ownerName;
            record.lastUpdated = dt;
        } catch (err) {
            console.log(err);
            throw new Error(`equipmet ${materialNumber} data can't be processed`);
        }
        await ctx.stub.putState(materialNumber, Buffer.from(JSON.stringify(record)));
        console.info('============= END : carmanufacturerReceived  ===========');
   }
   /**
     * query ledger record By Key
     *
     * @param {Context} ctx the transaction context
     * @param {String} key for record
   */
   async queryByKey(ctx, key) {
        let value = await ctx.stub.getState(key);
        const strValue = Buffer.from(value).toString('utf8');
        let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
        return JSON.stringify({
           Key: key, Record: record
        });
   }
   async queryHistoryByKey(ctx, key) {
      console.info('getting history for key: ' + key);
      let iterator = await ctx.stub.getHistoryForKey(key);
      let result = [];
      let res = await iterator.next();
      while (!res.done) {
        if (res.value) {
          const obj = JSON.parse(res.value.value.toString('utf8'));
          result.push(obj);
        }
        res = await iterator.next();
      }
      await iterator.close();
      console.info(result);
      return JSON.stringify(result);
  }
}
module.exports = DiskominfoassetLedgerContract;
