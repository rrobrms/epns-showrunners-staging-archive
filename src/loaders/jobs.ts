// Do Scheduling
// https://github.com/node-schedule/node-schedule
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
// Execute a cron job every 5 Minutes = */5 * * * *
// Starts from seconds = * * * * * *

import config from '../config';
import { Container } from 'typedi';
import schedule from 'node-schedule';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';


import BtcTickerChannel from '../showrunners/btcTickerChannel';
import EthTickerChannel from '../showrunners/ethTickerChannel';
import EnsExpirationChannel from '../showrunners/ensExpirationChannel';
import EthGasStationChannel from '../showrunners/ethGasChannel';
import CompoundLiquidationChannel from '../showrunners/compoundLiquidationChannel';
import Everest from '../showrunners/everestChannel';
import WalletTrackerChannel from '../showrunners/walletTrackerChannel';
import WalletMonitoring from '../services/walletMonitoring';
import HelloWorld from '../showrunners/helloWorldChannel';

export default ({ logger }) => {
  // 1. SHOWRUNNERS SERVICE
  const startTime = new Date(new Date().setHours(0, 0, 0, 0));
  // const startTime = new Date(Date.now());
  // console.log(startTime, Date.now())

  const twoAndHalfMinRule = new schedule.RecurrenceRule();
  twoAndHalfMinRule.minute = new schedule.Range(0, 59, 2);
  twoAndHalfMinRule.second = 30;

  const tenMinuteRule = new schedule.RecurrenceRule();
  tenMinuteRule.minute = new schedule.Range(0, 59, 10);

  const thirtyMinuteRule = new schedule.RecurrenceRule();
  tenMinuteRule.minute = new schedule.Range(0, 59, 30);

  const oneHourRule = new schedule.RecurrenceRule();
  oneHourRule.hour = new schedule.Range(0, 23);
  oneHourRule.minute = 0;
  oneHourRule.second = 0;

  const sixHourRule = new schedule.RecurrenceRule();
  sixHourRule.hour = new schedule.Range(0, 23, 6);
  sixHourRule.minute = 0;
  sixHourRule.second = 0;

  const dailyRule = new schedule.RecurrenceRule();
  dailyRule.hour = 0;
  dailyRule.minute = 0;
  dailyRule.second = 0;
  dailyRule.dayOfWeek = new schedule.Range(0, 6);

  // 1.1 BTC TICKER CHANNEL
  schedule.scheduleJob({ start: startTime, rule: sixHourRule }, async function () {
    logger.info('-- 🛵 Scheduling Showrunner - BTC Ticker Channel [on 6 Hours]');
    const btcTicker = Container.get(BtcTickerChannel);
    const taskName = 'BTC Ticker Fetch and sendMessageToContract()';

    try {
      await btcTicker.sendMessageToContract(false);
      logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    }
    catch (err) {
      logger.error(`❌ Cron Task Failed -- ${taskName}`);
      logger.error(`Error Object: %o`, err);
    }
  });

  // 1.2 ETH TICKER CHANNEL
  schedule.scheduleJob({ start: startTime, rule: sixHourRule }, async function () {
    logger.info('-- 🛵 Scheduling Showrunner - ETH Ticker Channel [on 6 Hours]');
    const ethTicker = Container.get(EthTickerChannel);
    const taskName = 'ETH Ticker Fetch and sendMessageToContract()';

    try {
      await ethTicker.sendMessageToContract(false);
      logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    }
    catch (err) {
      logger.error(`❌ Cron Task Failed -- ${taskName}`);
      logger.error(`Error Object: %o`, err);
    }
  });


  //1.3 ENS TICKER CHANNEL
  schedule.scheduleJob({ start: startTime, rule: dailyRule }, async function () {
    logger.info('-- 🛵 Scheduling Showrunner - ENS Domain Expiry Channel [on 24 Hours]');
    const ensTicker = Container.get(EnsExpirationChannel);
    const taskName = 'ENS Domain Expiry and sendMessageToContract()';

    try {
      await ensTicker.sendMessageToContract(false);
      logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    }
    catch (err) {
      logger.error(`❌ Cron Task Failed -- ${taskName}`);
      logger.error(`Error Object: %o`, err);
    }
  });

  // 1.4.1 GAS CHANNEL
  schedule.scheduleJob({ start: startTime, rule: tenMinuteRule }, async function () {
    logger.info('-- 🛵 Scheduling Showrunner - Gas Price Checker [on 10 minutes]' + new Date(Date.now()));
    const gasTicker = Container.get(EthGasStationChannel);
    const taskName = 'Gas result and sendMessageToContract()';

    try {
      await gasTicker.sendMessageToContract(false);
      logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    }
    catch (err) {
      logger.error(`❌ Cron Task Failed -- ${taskName}`);
      logger.error(`Error Object: %o`, err);
    }
  });

  // 1.4.2 GAS CHANNEL
  schedule.scheduleJob({ start: startTime, rule: dailyRule }, async function () {
    logger.info('-- 🛵 Scheduling Showrunner - Gas Average Update [on 24 hours]');
    const gasDbTicker = Container.get(EthGasStationChannel);
    const taskName = 'updated mongoDb';

    try {
      await gasDbTicker.updateGasPriceAverage();
      logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    }
    catch (err) {
      logger.error(`❌ Cron Task Failed -- ${taskName}`);
      logger.error(`Error Object: %o`, err);
    }
  });

  // 1.5 COMPOUND LIQUIDATION CHANNEL
  schedule.scheduleJob({ start: startTime, rule: dailyRule }, async function () {
    logger.info('-- 🛵 Scheduling Showrunner - Compound Liquidation Channel [on 24 Hours]');
    const compoundTicker = Container.get(CompoundLiquidationChannel);
    const taskName = 'Compound Liquidation address checks and sendMessageToContract()';

    try {
      await compoundTicker.sendMessageToContract(false);
      logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    }
    catch (err) {
      logger.error(`❌ Cron Task Failed -- ${taskName}`);
      logger.error(`Error Object: %o`, err);
    }
  });

  // 1.6 EVEREST CHANNEL
  schedule.scheduleJob({ start: startTime, rule: dailyRule }, async function () {
    logger.info('-- 🛵 Scheduling Showrunner - Everest Channel [on 24 Hours]');
    const everestTicker = Container.get(Everest);
    const taskName = 'Everest event checks and sendMessageToContract()';

    try {
      await everestTicker.sendMessageToContract(false);
      logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    }
    catch (err) {
      logger.error(`❌ Cron Task Failed -- ${taskName}`);
      logger.error(`Error Object: %o`, err);
    }
  });

  // 1.7 WALLET TRACKER CHANNEL
  schedule.scheduleJob({ start: startTime, rule: thirtyMinuteRule }, async function () {
    logger.info('-- 🛵 Scheduling Showrunner - Everest Channel [on 2.5 Minutes]');
    const walletTracker = Container.get(WalletTrackerChannel);
    const taskName = 'Track wallets on every new block mined';

    try {
      await walletTracker.sendMessageToContract(false);
      logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    }
    catch (err) {
      logger.error(`❌ Cron Task Failed -- ${taskName}`);
      logger.error(`Error Object: %o`, err);
    }
  });

  // 1.8 HELLO WORLD CHANNEL
  schedule.scheduleJob({ start: startTime, rule: oneHourRule }, async function () {
    logger.info('-- 🛵 Scheduling Showrunner - HelloWorld Channel [on 1 hour]');
    const helloTicker = Container.get(HelloWorld);
    const taskName = 'Hello world demo message and sendMessageToContract()';

    try {
      await helloTicker.sendMessageToContract(false);
      logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    }
    catch (err) {
      logger.error(`❌ Cron Task Failed -- ${taskName}`);
      logger.error(`Error Object: %o`, err);
    }
  });

  // 2. EVENT DISPATHER SERVICE
  const eventDispatcher = Container.get(EventDispatcherInterface);
  eventDispatcher.on("newBlockMined", async function (data) {
    // Disabled for now
    // // 2.1 Wallet Tracker Service
    // // Added condition to approx it at 10 blocks (150 secs approx)
    // if (data % 10 == 0) {
    //   const walletTracker = Container.get(WalletTrackerChannel);
    //   const taskName = 'Track wallets on every new block mined';
    //
    //   try {
    //     await walletTracker.sendMessageToContract(false);
    //     logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    //   }
    //   catch (err) {
    //     logger.error(`❌ Cron Task Failed -- ${taskName}`);
    //     logger.error(`Error Object: %o`, err);
    //   }
    // }
  })

  // 3.1 Wallets Monitoring Service
  schedule.scheduleJob({ start: startTime, rule: oneHourRule }, async function () {
    logger.info('-- 🛵 Scheduling Showrunner - Wallets Monitoring [every Hour]' + new Date(Date.now()));
    const walletMonitoring = Container.get(WalletMonitoring);
    const taskName = 'WalletMonitoring event checks and processWallet()';

    try {
      await walletMonitoring.processWallets(false);
      logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    }
    catch (err) {
      logger.error(`❌ Cron Task Failed -- ${taskName}`);
      logger.error(`Error Object: %o`, err);
    }
  });

  // 3.2 Main Wallet Monitoring Service
  schedule.scheduleJob({ start: startTime, rule: oneHourRule }, async function () {
    logger.info('-- 🛵 Scheduling Showrunner - Main Wallets Monitoring [every Hour]' + new Date(Date.now()));
    const walletMonitoring = Container.get(WalletMonitoring);
    const taskName = 'Main Wallet Monitoring event checks and processWallet()';

    try {
      await walletMonitoring.processMainWallet(false);
      logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    }
    catch (err) {
      logger.error(`❌ Cron Task Failed -- ${taskName}`);
      logger.error(`Error Object: %o`, err);
    }
  });
};
