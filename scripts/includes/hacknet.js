
export class Hacknet {
  /** @param {NS} ns */
  constructor(ns) {
    this.ns = ns
    this.nodeCount = ns.hacknet.numNodes()
    this.nodeCost = ns.hacknet.getPurchaseNodeCost()
  }

  hasMaxNodes() {
    this.nodeCount = this.ns.hacknet.numNodes()
    return (this.nodeCount >= this.ns.hacknet.maxNumNodes())
  }

  performUpgrades() {
    let money = this.ns.getPlayer().money

    if (money >= this.nodeCost) {
      this.ns.hacknet.purchaseNode()
      this.nodeCost = this.ns.hacknet.getPurchaseNodeCost()
      money -= this.nodeCost
      this.nodeCount++
    }

    for (let i = 0; i < this.nodeCount; i++) {
      let ramCost = this.ns.hacknet.getRamUpgradeCost(i)
      let coreCost = this.ns.hacknet.getCoreUpgradeCost(i)
      let levelCost = this.ns.hacknet.getLevelUpgradeCost(i)

      if (ramCost != 'Infinity' && ramCost < (this.nodeCost / 2)) {
        if (money >= ramCost) {
          this.ns.hacknet.upgradeRam(i)
          money -= ramCost
        }
      }

      if (coreCost != 'Infinity' && coreCost < (ramCost / 4) && coreCost < (this.nodeCost / 2)) {
        if (money >= coreCost) {
          this.ns.hacknet.upgradeCore(i)
          money -= coreCost
        }
      }

      if (levelCost != 'Infinity' && levelCost < (coreCost / 16) && levelCost < (this.nodeCost / 2)) {
        if (money >= levelCost) {
          this.ns.hacknet.upgradeLevel(i)
        }
      }
    }
  }
}
