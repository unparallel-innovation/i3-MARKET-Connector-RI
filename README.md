# Connector-RI

This connector implements the logic needed to connect the SDK-RI and SDK-Core, providing an abstraction used by the Web-RI

## Installation

```bash
npm install @unparallel/connector-ri
```

## How to use

```bash
import Connector from '@unparallel/connector-ri'

const connector = new Connector(SDK_RI_ENDPOINT, I3MARKET_USERNAME, I3MARKET_PASSWORD, LOG_LEVEL) 
# SDK_RI_ENDPOINT: pilot endpoint
# I3MARKET_USERNAME: i3-MARKET login username
# PASSWORD: i3-MARKET login password
# I3MARKET_PASSWORD: logs level (more info: https://github.com/jonnyreeves/js-logger) 
```

### Available functions
````bash
getOfferingTemplate() # get template for register an offering
getOfferings() # get list of offerings
getProviders() # get list of providers
getCategories() # get list of categories
getOffering(OFFERING_ID) # get details for a specific offering
getProviderOfferings(PROVIDER_ID) # get list of offerings from a provider
getCategoryOfferings(CATEGORY) # get list of offering from a category
getOfferingsByCategory() # get list of offerings by categories
getOfferingContractParameters(OFFERING_ID) # get list of contract parameters from a specific category
registerOffering(DATA) # register a new offering
deleteOffering(OFFERING_ID) # delete an offering
````

### Example

````bash
const offerings = await connector.getProviderOfferings(PROVIDER_ID)
````


## Credits
This repository has been created by:

Márcio Mateus [marcio.mateus@unparallel.pt](mailto:marcio.mateus@unparallel.pt)

Pedro Ferreira [pedro.ferreira@unparallel.pt](mailto:marcio.mateus@unparallel.pt)

## License
The code in ths repository is licensed under the [MIT License](https://opensource.org/licenses/MIT).

___
###### This work was done in the context of i3-MARKET Research Project, which has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 871754
