import { datadogLogs } from "@datadog/browser-logs";
import packageJson from '../package.json';

export default {
    install(app: any, options: { clientToken: string }) {
        console.log(window.location)
        datadogLogs.init({
            clientToken: options.clientToken,
            site: 'datadoghq.com',
            forwardErrorsToLogs: true,
            sessionSampleRate: 100,
            env: 'local',
            service: 'frontend',
        })        
        const logger = datadogLogs.createLogger('frontend', {
            handler: 'http',
            context: {
                env: 'local',
                host: window.location.host,
                version: packageJson.version,
                location: window.location.hash
            }
        });
        app.provide('logger', logger);
    }
}