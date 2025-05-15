export default function multiModuleStyles(...args) {
    args = args.map(arg => (Array.isArray(arg) ? multiModuleStyles(...arg) : arg));
    return args.filter(Boolean).join(" ");
}
