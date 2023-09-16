/** @param {NS} ns */
export async function main(ns) {
  let host = ns.args[0]
  let securityLimit = ns.args[1] * 1.2
  let moneyLimit = ns.args[2] * 0.9

  while(true) {
    if (ns.getServerSecurityLevel(host) > securityLimit) {
      await ns.weaken(host)
    } else if (ns.getServerMoneyAvailable(host) < moneyLimit) {
      await ns.grow(host)
    } else {
      await ns.hack(host)
    }
  }
}