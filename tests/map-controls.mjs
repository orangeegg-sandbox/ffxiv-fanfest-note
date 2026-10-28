// Use the same visible venue and hall choices as a visitor, including when a hall
// tab is currently hidden because an external venue is selected.
export async function selectMap(page, mapId) {
  if (mapId === 'area-overview' || mapId === 'aeon' || mapId === 'toyosuna') {
    await page.locator(`.map-venue-button[data-map-venue="${mapId}"]`).click();
  } else {
    const tab = page.locator(`[role="tab"][data-map-id="${mapId}"]`);
    if (!await tab.count()) await page.locator('.map-venue-button[data-map-venue="messe"]').click();
    await tab.click();
  }
  await page.locator(`#map-canvas[data-map-id="${mapId}"]`).waitFor();
}
