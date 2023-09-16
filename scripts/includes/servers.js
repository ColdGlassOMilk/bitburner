
export class Servers {
  /** @param {NS} ns */
  constructor(ns) {
    this.ns = ns
    this.sharePath = 'scripts/share.js'
    this.workerPath = 'scripts/worker.js'
    this.exploits = {
      'BruteSSH.exe': function (server) { ns.brutessh(server) },
      'FTPCrack.exe': function (server) { ns.ftpcrack(server) },
      'relaySMTP.exe': function (server) { ns.relaysmtp(server) },
      'HTTPWorm.exe': function (server) { ns.httpworm(server) },
      'SQLInject.exe': function (server) { ns.sqlinject(server) }
    }
  }

  backdoorInstalled(target) { return this.ns.getServer(target)['backdoorInstalled'] }

  exploitCount() {
    let count = 0
    for (let exploit in this.exploits) {
      if (this.ns.fileExists(exploit)) { count++ }
    }
    return count
  }

  installExploits() {
    for (let server of this.listExploitable()) {
      for (let exploit in this.exploits) {
        if (this.ns.fileExists(exploit)) { this.exploits[exploit](server) }
      }

      this.ns.nuke(server)
    }
  }

  children(target) {
    let results = this.ns.scan(target)
    if (target != 'home') { results.shift() }
    return results
  }

  list(target = 'home') {
    let servers = []

    for (let child of this.children(target)) {
      servers.push(child)
      servers = servers.concat(this.list(child))
    }

    return servers
  }

  listPurchased() {
    return this.list().filter((server) => server.startsWith('pserv-'))
  }

  listExploitable() {
    let servers = []
    for (let server of this.list()) {
      if (this.ns.getServerNumPortsRequired(server) <= this.exploitCount() && !server.startsWith('pserv-')) {
        if (this.ns.getServerRequiredHackingLevel(server) <= this.ns.getHackingLevel()) {
          servers.push(server)
        }
      }
    }
    return servers
  }

  listHackable() {/*
    let servers = []

    for (let server of this.listExploitable()) {
      if (this.ns.getServerMoneyAvailable(server) > 0) {
        servers.push(server)
      }
    }

    return servers*/
    return this.listExploitable()
  }

  path(target = 'home') {
    let path = [target]
    while (target != 'home') {
      target = this.ns.scan(target)[0]
      path.push(target)

      if (this.backdoorInstalled(target)) { break }
    }
    return path.reverse()
  }

  maxThreads(script, target = 'home') {
    let scriptRam = this.ns.getScriptRam(script, target)
    let serverRam = this.ns.getServerMaxRam(target) - this.ns.getServerUsedRam(target)
    let result = Math.floor(serverRam / scriptRam)
    result = (result == 'Infinity') ? 100 : result
    return (result == 0) ? 1 : result
  }

  deployShare(target, threadCount) {
    this.ns.rm(this.sharePath, target)
    this.ns.scp(this.sharePath, target, 'home')
    this.executeShare(target, threadCount)
  }

  executeShare(target, threadCount) {
    this.ns.exec(this.sharePath, target, threadCount)
  }

  deployShares() {
    for (let server of this.listPurchased()) {
      this.ns.killall(server)
      //this.deployLocalWorkers(server)
      this.deployShare(server, this.maxThreads(this.sharePath, server))
    }
  }

  deployWorker(host, target, threadCount) {
    this.ns.rm(this.workerPath, target)
    this.ns.scp(this.workerPath, target, 'home')
    this.executeWorker(host, target, threadCount)
  }

  executeWorker(host, target, threadCount) {
    this.ns.exec(this.workerPath, host, threadCount, target, this.ns.getServerMinSecurityLevel(target), this.ns.getServerMaxMoney(target))
  }

  deployLocalWorkers(target = 'home') {
    this.ns.killall(target)
    let maxThreadCount = Math.floor(this.maxThreads(this.workerPath, target) / this.listHackable().length)
    maxThreadCount = (maxThreadCount > 0) ? maxThreadCount : 1

    for (let server of this.listHackable()) {
      this.deployWorker(target, server, maxThreadCount)
    }
  }

  deployRemoteWorker(target) {
    this.ns.killall(target)
    this.deployWorker(target, target, this.maxThreads(this.workerPath, target))
  }

  deployWorkers() {
    this.deployLocalWorkers()
    for (let server of this.listHackable()) {
      this.deployRemoteWorker(server)
    }
  }
}
