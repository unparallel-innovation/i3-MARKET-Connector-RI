const Logger = require("js-logger");
const axios = require("axios");
const {FetchError} = require("./error");

class NotificationService{
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    async _fetchNotificationService(accessToken, idToken, method, service, data){
        const url = this.endpoint + service;

        const headers = {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'access_token': accessToken,
            'id_token': idToken
        }

        const config = {
            method: method,
            url: url,
            headers: headers
        }

        if(data)
            config.data = JSON.stringify(data)

        Logger.debug("\nFetch URL: " + url)

        try {
            const res = await axios(config)
            const resultData = res.data
            if(resultData.data){
                return resultData.data
            }
        } catch (e){
            if(e.response.status === 404) {
                Logger.error(e.response.data.statusDescription)
                return []
            }
            throw new FetchError(e)
        }
    }

    async _existsNotificationService(accessToken, idToken, name, endpoint){
        const services = await this.getNotificationServices(accessToken, idToken);
        return services.find(el => el.name === name);
    }

    async _existsNotificationServiceQueue(accessToken, idToken, serviceId, name){
        const services = await this.getNotificationServiceQueues(accessToken, idToken, serviceId);
        return services.queues.find(el => el.name === name);
    }

    async getNotificationServices(accessToken, idToken){
        return await this._fetchNotificationService(accessToken, idToken, 'GET', `/SdkRefImpl/api/sdk-ri/services/`)
    }

    async getNotificationServiceQueues(accessToken, idToken, serviceId){
        return await this._fetchNotificationService(accessToken, idToken, 'GET', `/SdkRefImpl/api/sdk-ri/services/${serviceId}`)
    }

    async createNotificationService(accessToken, idToken, marketId, name, endpoint){
        const service = await this._existsNotificationService(accessToken, idToken, name, endpoint)
        if(service){
            Logger.debug(`[Notification Service] name "${name}" already exists.`);

            if(service.endpoint === endpoint){
                // notification service with same endpoint, return the object
                Logger.debug(`[Notification Service] endpoint "${endpoint}" exists. Return the object.`)
                return service
            }
            else{
                Logger.debug(`[Notification Service] New endpoint. Delete previous service and create a new one with new endpoint.`)
                // delete previous notification service
                await this.deleteNotificationService(accessToken, idToken, service.id);
                // create a new notification service with new endpoint
                return await this._fetchNotificationService(accessToken, idToken, 'POST', `/SdkRefImpl/api/sdk-ri/services/`, {endpoint, name, marketId});
            }
        }
        return await this._fetchNotificationService(accessToken, idToken, 'POST', `/SdkRefImpl/api/sdk-ri/services/`, {endpoint, name, marketId});
    }

    async getNotificationService(accessToken, idToken, serviceId){
        return await this._fetchNotificationService(accessToken, idToken, 'GET', `/SdkRefImpl/api/sdk-ri/services/${serviceId}`);
    }

    async deleteNotificationService(accessToken, idToken, serviceId){
        return await this._fetchNotificationService(accessToken, idToken, 'DELETE', `/SdkRefImpl/api/sdk-ri/services/${serviceId}`);
    }

    async createNotificationServiceQueue(accessToken, idToken, serviceId, name){
        const queue = await this._existsNotificationServiceQueue(accessToken, idToken, serviceId, name)
        if(queue){
            Logger.debug(`[Notification Service] Queue "${name}" already exists. Return the object`);
            return queue
        }
        return await this._fetchNotificationService(accessToken, idToken, 'POST', `/SdkRefImpl/api/sdk-ri/services/${serviceId}/queues`, {name})
    }

    async deleteNotificationServiceQueue(accessToken, idToken, serviceId, queueId){
        return await this._fetchNotificationService(accessToken, idToken, 'DELETE', `/SdkRefImpl/api/sdk-ri/services/${serviceId}/queues/${queueId}`)
    }

    async getNotificationServiceQueue(accessToken, idToken, serviceId, queueId){
        return await this._fetchNotificationService(accessToken, idToken, 'GET', `/SdkRefImpl/api/sdk-ri/services/${serviceId}/queues/${queueId}`)
    }
}

exports.NotificationService = NotificationService
