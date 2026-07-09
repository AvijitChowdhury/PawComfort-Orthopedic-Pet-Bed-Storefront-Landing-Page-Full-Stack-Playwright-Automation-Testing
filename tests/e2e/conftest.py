import pytest_asyncio
from playwright.async_api import async_playwright


@pytest_asyncio.fixture(scope="session")
async def browser():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        yield b
        await b.close()


@pytest_asyncio.fixture
async def page(browser):
    ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
    p = await ctx.new_page()
    yield p
    await ctx.close()
