export function scrollToPledge(): void {
  const ref = document.getElementById('pledge')
  if (ref != null) {
    ref.scrollIntoView()
  }
}
