
import { Hacknet } from 'scripts/includes/hacknet.js'

export async function main(ns) {
  let hackNet = new Hacknet(ns)

  ns.tprintf("Starting Hacknet...")

  while (!hackNet.hasMaxNodes()) {
    hackNet.performUpgrades()
    await ns.sleep(10)
  }

  ns.tprintf("Shutting down Hacknet (Max Nodes)")
}