
import { Servers } from 'scripts/includes/servers.js'

/** @param {NS} ns */
export async function main(ns) {
  let myServers = new Servers(ns)
  let playerLevel = ns.getHackingLevel()

  ns.tprintf("Generating Backdoor Report...")
  for (let server of myServers.list()) {
    if (!myServers.backdoorInstalled(server) && playerLevel >= ns.getServerRequiredHackingLevel(server) && !server.startsWith('pserv-')/* && myServers.children(server).length == 0*/) {
      ns.tprintf(myServers.path(server).join(' -> '))
    }
  }
}