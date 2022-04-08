import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://api.coinpaprika.com'
})

export const EditorAPI = {
    getCoins: function () {
        return axiosInstance.request({
            method: 'GET',
            url: '/v1/coins'
        })
    },
    getTicker: function () {
        return axiosInstance.request({
            method: 'GET',
            url: `/v1/tickers`
        })
    }

}