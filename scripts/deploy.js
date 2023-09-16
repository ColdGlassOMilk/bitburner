
import { Servers } from 'scripts/includes/servers.js'

/** @param {NS} ns */
export async function main(ns) {
  let myServers = new Servers(ns)

  myServers.installExploits()
  myServers.deployWorkers()
  myServers.deployShares()

  ns.tprintf("%d Exploitable Servers", myServers.listExploitable().length)
  ns.tprintf("%d Hackable Servers (Beta - Does not factor emptied servers)", myServers.listHackable().length)
  ns.tprintf("%d Purchased Servers", myServers.listPurchased().length)
  //ns.run('scripts/hacknet.js')
  ns.run('scripts/report.js')
}
