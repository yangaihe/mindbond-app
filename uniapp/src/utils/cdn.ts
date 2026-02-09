let cdnPrefix = ''

export const initConfig = (prefix = '')=> {
	cdnPrefix = prefix
}

export const getResourceUrl = (url = '')=> {
	if(url.indexOf('://') > -1) {
		return url
	} else {
		return `${cdnPrefix}${url}`
	}
}