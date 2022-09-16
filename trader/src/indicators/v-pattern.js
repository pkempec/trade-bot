//https://www.moneyshow.com/articles/tradingidea-51449/

/**
 * 1. detect current trend
 * 2. detect down trend
 * 3. detect up trend
 * 4. detect pullback
 * 5. set target
 * - consider setting scale
 */


/**
 * 1. Detect current trend
 * 
 * If we consider that trend should have the length of at least a length of V shape than we need to calculate p50 ?
 * 
 * Find several maximums while there is specified delay between those max
 * Find several minimums while there is specified delay between those max
 * 
 * findMax(values, count, delay): [] ordered
 * findMin(values, count, delay): [] ordered
 * 
 *  Is currently - down/up trend?
 * isDowntrend(values) -> are MINs lower and lower?
 * isDowntrend(values) -> are MINs lower and lower?
 * 
 */


/**
 * 
 * indicatorUp = 0
 * indicatorDown = 0
 * 
 * Iterate
 * capture max
 * capture min
 * compare each with max if there is new max add +1 to indicatorUp
 * compare each with min if there is new min add +1 to indicatorDown
 * Based on count of all values and indicators value consider what value is uptrend
 * 
 * The bigger indicators value the bigger trend is.
 * 
 */