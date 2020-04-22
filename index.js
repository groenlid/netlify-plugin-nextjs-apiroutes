const fs = require('fs')
const { promises } = fs
//import { promises as fs } from "fs"
const { appendFile, writeFile, readFile } = fs

const nextPath = ".next"
const manifestPath = `${nextPath}/pages-manifest.json`

async function readPagesManifest() {
    try {
        const manifest = await readFile(manifestPath, { encoding: 'utf-8'})
        return JSON.parse(manifest);
    } catch(err){
        if(err.code === 'ENOENT') return
        throw err
    }
}

function getApiRoutes(manifest) {
    return Object.fromEntries(manifest.entries(manifest).filter(([key, _]) => key.startsWith('/api')))
}

function netlifyPlugin(conf) {
    return {
        name: 'netlify-plugin-nextjs-apiroutes',
        async onPostBuild(opts) {
            console.log('Find nextjs pages-manifest.json')
            const manifest = await readPagesManifest()
            if(!manifest) {
                console.log('No nextjs pages-manifest file found. Will exit early')
                return
            }
            console.log('Read through to find all api routes')
            const apiRoutes = getApiRoutes(manifest)
            console.log('Add rewrite rule to redirect file')
            console.log('Add a new handler to handle the nextjs api route')
        }
    }
}

module.exports = netlifyPlugin