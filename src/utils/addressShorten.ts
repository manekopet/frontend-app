export default function addressShorten(address?: string, first = 4, last = 3) {
  return address
    ? `${address.substring(0, first)}...${address.substring(
        address.length - last
      )}`
    : "";
}
