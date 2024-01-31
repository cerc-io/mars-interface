#!/bin/bash

set -e

RECORD_FILE=tmp.rf.$$
CONFIG_FILE=`mktemp`

rcd_name=$(jq -r '.name' package.json | sed 's/null//' | sed 's/^@//')
rcd_app_version=$(jq -r '.version' package.json | sed 's/null//')

cat <<EOF > "$CONFIG_FILE"
services:
  cns:
    restEndpoint: '${CERC_REGISTRY_REST_ENDPOINT:-http://console.laconic.com:1317}'
    gqlEndpoint: '${CERC_REGISTRY_GQL_ENDPOINT:-http://console.laconic.com:9473/api}'
    chainId: ${CERC_REGISTRY_CHAIN_ID:-laconic_9000-1}
    gas: 550000
    fees: 20000aphoton
EOF

if [ -z "$CERC_REGISTRY_APP_CRN" ]; then
  authority=$(echo "$rcd_name" | cut -d'/' -f1 | sed 's/@//')
  app=$(echo "$rcd_name" | cut -d'/' -f2-)
  CERC_REGISTRY_APP_CRN="crn://$authority/applications/$app"
fi

APP_RECORD=$(laconic -c $CONFIG_FILE cns name resolve "$CERC_REGISTRY_APP_CRN" | jq '.[0]')
if [ -z "$APP_RECORD" ] || [ "null" == "$APP_RECORD" ]; then
  echo "No record found for $CERC_REGISTRY_APP_CRN."
  exit 1
fi

cat <<EOF | sed '/.*: ""$/d' > "$RECORD_FILE"
record:
  type: ApplicationDeploymentRequest
  version: 1.0.0
  name: "$rcd_name@$rcd_app_version"
  application: "$CERC_REGISTRY_APP_CRN@$rcd_app_version"
  dns: "$CERC_REGISTRY_DEPLOYMENT_SHORT_HOSTNAME"
  deployment: "$CERC_REGISTRY_DEPLOYMENT_CRN"
  config:
    env:
      CERC_WEBAPP_DEBUG: "$rcd_app_version"
      CERC_MAX_GENERATE_TIME: 180
      CERC_NEXT_VERSION: 13.4.2
      URL_OSMOSIS_GQL: "https://osmosis-node.marsprotocol.io/GGSFGSFGFG34/osmosis-hive-front/graphql"
      URL_OSMOSIS_REST: "https://lcd-osmosis.blockapsis.com"
      URL_OSMOSIS_RPC: "https://rpc-osmosis.blockapsis.com"
      URL_NEUTRON_GQL: "https://neutron.rpc.p2p.world/qgrnU6PsQZA8F9S5Fb8Fn3tV3kXmMBl2M9bcc9jWLjQy8p/hive/graphql"
      URL_NEUTRON_REST: "https://rest-kralum.neutron-1.neutron.org"
      URL_NEUTRON_RPC: "https://rpc-kralum.neutron-1.neutron.org"
      URL_NEUTRON_TEST_GQL: "https://testnet-neutron-gql.marsprotocol.io/graphql"
      URL_NEUTRON_TEST_REST: "https://rest-palvus.pion-1.ntrn.tech"
      URL_NEUTRON_TEST_RPC: "https://rpc-palvus.pion-1.ntrn.tech"
      WALLET_CONNECT_ID: "0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0"
  meta:
    note: "Added by CI @ `date`"
    repository: "`git remote get-url origin`"
    repository_ref: "${GITHUB_SHA:-`git log -1 --format="%H"`}"
EOF

cat $RECORD_FILE
RECORD_ID=$(laconic -c $CONFIG_FILE cns record publish --filename $RECORD_FILE --user-key "${CERC_REGISTRY_USER_KEY}" --bond-id ${CERC_REGISTRY_BOND_ID} | jq -r '.id')
echo $RECORD_ID

rm -f $RECORD_FILE $CONFIG_FILE
