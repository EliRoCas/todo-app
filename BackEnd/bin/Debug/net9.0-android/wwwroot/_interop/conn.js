function dateReviver(key, value) {
    if (typeof value === 'string' && value.startsWith('__DATE__')) {
        return new Date(value.replace('__DATE__', ''));
    }
    return value;
}

function dateReplacer(key, value) {
    if (value instanceof Date) {
        return `__DATE__${value.toISOString()}`; // Add a special marker
    }
    return value;
}
function encodeBase64Utf8(str) {
    let utf8Bytes = new TextEncoder().encode(str);
    let binaryStr = String.fromCharCode(...utf8Bytes);
    return btoa(binaryStr);
}

function decodeFromBase64Utf8(base64Str) {
    let binaryStr = atob(base64Str);
    let utf8Bytes = new Uint8Array([...binaryStr].map(char => char.charCodeAt(0)));
    return new TextDecoder().decode(utf8Bytes);
}

window.MauiInterop = {
    dotnetCallsQueue: [],

    onError(e) {
        console.error(e);
    },

    _castResponse(input) {
        try {
            return JSON.parse(input, dateReviver);
        } catch {
            return input;
        }
    },

    subscribe(topic, callback) {
        try {
            const id = crypto.randomUUID();
            let url = `dotnet://subscribe?id=${id}&topic=${encodeURIComponent(topic)}`;
            window.MauiInterop.dotnetCallsQueue.push({ id, resolve: callback });
            window.location.href = url;

            return {
                unSubscribe: () => window.MauiInterop.unSubscribe(id)
            };

        } catch (e) {
            window.MauiInterop.onError(e);
        }
    },

    unSubscribe(id) {
        let url = `dotnet://unsubscribe?id=${id}`;
        window.location.href = url;
    },

    async invoke(controller, action, ...params) {
        try {
            let fullResponse = '';
            const id = crypto.randomUUID();
            let token = { message: '', continuationToken: 0 };

            do {
                token = await window.MauiInterop._invokeMethod(id, controller, action, token.continuationToken, ...params);
                fullResponse += token.message;
            } while (token.continuationToken);

            return window.MauiInterop._castResponse(fullResponse);

        } catch (e) {
            window.MauiInterop.onError(e);
        }
    },

    async _invokeMethod(id, controller, action, continuationToken, ...params) {
        try {

            var encodedParams = params.map((p, i) => `param${i}=${encodeBase64Utf8(JSON.stringify(p, dateReplacer))}`).join('&');

            return new Promise((resolve, reject) => {
                let url = `dotnet://invoke?id=${id}&controller=${controller}&action=${action}&chunk=${continuationToken}&${encodedParams}`;
                window.MauiInterop.dotnetCallsQueue.push({ id, resolve, reject });
                window.location.href = url;
            });

        } catch (e) {
            window.MauiInterop.onError(e);
        }
    },

    _resolve(id, response, deleteId = true) {
        let promise = window.MauiInterop.dotnetCallsQueue.find(x => x.id === id);

        if (promise && promise.resolve) {

            if (deleteId) {
                window.MauiInterop.dotnetCallsQueue = window.MauiInterop.dotnetCallsQueue.filter(x => x.id !== id);
            }
            promise.resolve(JSON.parse(decodeFromBase64Utf8(response), dateReviver));
        }
    },

    _catch(id, response, deleteId = true) {
        let promise = window.MauiInterop.dotnetCallsQueue.find(x => x.id === id);

        if (promise && promise.reject) {
            if (deleteId) {
                window.MauiInterop.dotnetCallsQueue = window.MauiInterop.dotnetCallsQueue.filter(x => x.id !== id);
            }

            promise.reject(decodeFromBase64Utf8(response));
        }
    }
};
