#!/bin/bash

# Diskominfo Jabar Asset network Hyperledger Fabric
# diskominfo asset ledger blockhain network
# Author: PJ
# invoke smart contract
CHANNEL_NAME=dalnchannel
CC_SRC_LANGUAGE=javascript
VERSION=1
DELAY=3
MAX_RETRY=5
VERBOSE=true
CHINCODE_NAME="diskominfoassetLedgerContract"
FABRIC_CFG_PATH=$PWD/../config/

rawmaterial=""
materialNumber=""
materialName=""
ownerName=""

# import utils
. scripts/utils.sh

chaincodeInvokeInit() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "chaincodeInvokeInit" 1
  set -x
  peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CHINCODE_NAME} $PEER_CONN_PARMS  -c '{"function":"instantiate","Args":[]}' >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "chaincodeInvokeInit" "Invoke transaction successful"
  echo
}
invokeMakeMaterial() {
  parsePeerConnectionParameters $@
  echo "invokeMakeMaterial--> rawmaterial:$rawmaterial, materialNumber:$materialNumber, materialName: $materialName,ownerName:$ownerName"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "invokeMakeMaterial" 2
  set -x
  peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CHINCODE_NAME} $PEER_CONN_PARMS  -c '{"function":"createMaterial","Args":["'$rawmaterial'","'$materialNumber'", "'$materialName'", "'$ownerName'"]}' >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "invokeMakeMaterial" "Invoke transaction successful"
  echo
}
invokePartsupplierDistribute() {
  parsePeerConnectionParameters $@
  echo "invokeWolesalerDistribute--> materialNumber: $materialNumber, - ownerName: $ownerName"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "invokeShipToPartsupplier" 3
  set -x
  peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CHINCODE_NAME} $PEER_CONN_PARMS  -c '{"function":"partsupplierDistribute","Args":[ "'$materialNumber'", "'$ownerName'"]}' >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "invokeWolesalerDistribute" "Invoke transaction successful"
  echo
}
invokeCarmanufacturerReceived() {
  parsePeerConnectionParameters $@
  echo "invokeCarmanufacturerReceived--> materialNumber: $materialNumber, - ownerName: $ownerName"
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "
  starCallFuncWithStepLog "invokeCarmanufacturerReceived" 4
  set -x
  peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CHINCODE_NAME} $PEER_CONN_PARMS  -c '{"function":"carmanufacturerReceived","Args":["'$materialNumber'", "'$ownerName'"]}' >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  endCallFuncLogWithMsg "invokeCarmanufacturerReceived" "Invoke transaction successful"
  echo
}
chaincodeQuery() {
  ORG=$1
  QUERY_KEY=$2
  setGlobalVars $ORG
  callStartLog "chaincodeQuery $QUERY_KEY"
	local rc=1
	local COUNTER=1
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to Query peer0.org${ORG}, Retry after $DELAY seconds."
    set -x
    peer chaincode query -C $CHANNEL_NAME -n ${CHINCODE_NAME} -c '{"function":"queryByKey","Args":["'$QUERY_KEY'"]}' >&log.txt
    res=$?
    set +x
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
  echo
  cat log.txt
  verifyResult $res " Query result on peer0.org${ORG} is INVALID"
  endCallFuncLogWithMsg "chaincodeQuery" "Query successful"
}
chaincodeQueryHistory() {
  ORG=$1
  QUERY_KEY=$2
  setGlobalVars $ORG
  callStartLog "chaincodeQueryHistory"
	local rc=1
	local COUNTER=1
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to Query peer0.org${ORG}, Retry after $DELAY seconds."
    set -x
    peer chaincode query -C $CHANNEL_NAME -n ${CHINCODE_NAME} -c '{"function":"queryHistoryByKey","Args":["'$QUERY_KEY'"]}' >&log.txt
    res=$?
    set +x
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
  echo
  cat log.txt
  verifyResult $res " Query History result on peer0.org${ORG} is INVALID"
  endCallFuncLogWithMsg "chaincodeQuery" "Query History successful"
}

## Invoke the chaincode
#chaincodeInvokeInit 1 2 3

#sleep 10
#chaincodeQuery 1

#invokeMakeMaterial 1 2 3
#sleep 10
#chaincodeQuery 1

#invokeWolesalerDistribute 1 2 3
#sleep 10
#chaincodeQuery 1

#invokeCarmanufacturerReceived 1 2 3
#sleep 10

#chaincodeQuery 1

#chaincodeQueryHistory 1
# Query chaincode on peer0.org1

function printHelp() {
  echo "Usage: "
  echo "  invokeContract.sh <Mode>"
  echo "    <Mode>"
  echo "      - 'init' - invoke chaincodeInvokeInit"
  echo "      - 'query' - query ledger record"
  echo "      - 'queryHistory' - query ledger history records"
  echo "      - 'material' - invoke invokeMakeMaterial"
  echo "      - 'wolesaler' - invoke invokeWolesalerDistribute"
  echo "      - 'carmanufacturer' - invoke invokeCarmanufacturerReceived"
  echo
  echo " Examples:"
  echo "  invokeContract.sh init"
  echo "  invokeContract.sh query"
  echo "  invokeContract.sh queryHistory"
  echo "  invokeContract.sh material"
  echo "  invokeContract.sh wolesaler"
  echo "  invokeContract.sh carmanufacturer"
}
## Parse mode
if [[ $# -lt 1 ]] ; then
  printHelp
  exit 0
else
  MODE=$1
  shift
fi


if [ "${MODE}" == "init" ]; then
  chaincodeInvokeInit 1 2 3
elif [ "${MODE}" == "query" ]; then
  if [[ $# -ne 1 ]] ; then
    printHelp
    exit 0
  fi
  chaincodeQuery 1 $1
elif [ "${MODE}" == "queryHistory" ]; then
  if [[ $# -ne 1 ]] ; then
    printHelp
    exit 0
  fi
  chaincodeQueryHistory 1 $1
elif [ "${MODE}" == "material" ]; then
  if [[ $# -ne 4 ]] ; then
    printHelp
    exit 0
  fi
  rawmaterial=$1
  materialNumber=$2
  materialName=$3
  ownerName=$4
  invokeMakeMaterial 1 2 3
elif [ "${MODE}" == "partsupplier" ]; then
  if [[ $# -ne 2 ]] ; then
    printHelp
    exit 0
  fi
  materialNumber=$1
  ownerName=$2
  invokePartsupplierDistribute 1 2 3
elif [ "${MODE}" == "carmanufacturer" ]; then
   if [[ $# -ne 2 ]] ; then
    printHelp
    exit 0
  fi
  materialNumber=$1
  ownerName=$2
  invokeCarmanufacturerReceived 1 2 3
else
  printHelp
  exit 1
fi

exit 0
