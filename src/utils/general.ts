import Web3 from "web3";

export const params = ["temperature", "humidity"];
export const DEFAULT_PRODUCT_IMAGE = "https://res.cloudinary.com/dp0ayty6p/image/upload/v1679818316/product_a0x0jp.png";

export const hasWindow = () => typeof window !== 'undefined';

export const weiToEth = (wei: any) => Number(Web3.utils.fromWei(wei)).toPrecision(4);

export const timestampToDate = (timestamp: number | string) => new Date(Number(timestamp)*1000);
export const dateToTimestamp = (date: Date) => Number((Number(date)/1000).toFixed())
export const currDateToTimestamp = () => dateToTimestamp(new Date());

export const unitsToTemperature = (units: number | string) => Number(units)/100;
export const unitsToHumidity = (units: number | string) => Math.max(0, Number(units)/100); // Cap

export const temperatureToUnits = (temperature: number | string) => Number(Number(Number(temperature) * 100).toFixed());
export const humidityToUnits = (humidity: number | string) => Number(Number(Number(humidity) * 100).toFixed());

export const productIdentifierToDetails = (text: string) => {
  const split = text.split('_');
  return {
    producer: split[0],
    id: Number(split[1]),
  }
}