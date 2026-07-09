"""PawComfort™ End-to-End Test Suite (Playwright + Allure)."""
import os
import re
import asyncio
from pathlib import Path
import pytest
import allure
from playwright.async_api import async_playwright, Page, expect

BASE_URL = "http://localhost:8080"
ADMIN_EMAIL = "abhichy30@gmail.com"
ADMIN_PASS = "12345678"
SHOTS = Path("/mnt/documents/pawcomfort/screenshots")
SHOTS.mkdir(parents=True, exist_ok=True)


def _slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")


async def snap(page: Page, name: str):
    path = SHOTS / f"{name}.png"
    await page.screenshot(path=str(path))
    allure.attach.file(str(path), name=name, attachment_type=allure.attachment_type.PNG)
    return path




@allure.epic("PawComfort Storefront")
@allure.feature("Landing Page")
class TestLanding:
    @allure.title("Hero section renders with product headline & CTA")
    @pytest.mark.asyncio
    async def test_hero(self, page):
        await page.goto(BASE_URL, wait_until="networkidle")
        await expect(page.locator("h1").first).to_be_visible()
        await snap(page, "01_landing_hero")

    @allure.title("Gallery, features, sizes & colors sections load")
    @pytest.mark.asyncio
    async def test_sections(self, page):
        await page.goto(BASE_URL, wait_until="networkidle")
        await page.evaluate("window.scrollTo(0, 900)")
        await asyncio.sleep(0.5)
        await snap(page, "02_landing_gallery_features")
        await page.evaluate("window.scrollTo(0, 1900)")
        await asyncio.sleep(0.5)
        await snap(page, "03_landing_sizes_colors")

    @allure.title("Reviews and FAQ sections visible")
    @pytest.mark.asyncio
    async def test_reviews_faq(self, page):
        await page.goto(BASE_URL, wait_until="networkidle")
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight * 0.6)")
        await asyncio.sleep(0.6)
        await snap(page, "04_landing_reviews")
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight * 0.85)")
        await asyncio.sleep(0.6)
        await snap(page, "05_landing_faq")


@allure.epic("PawComfort Storefront")
@allure.feature("Order Placement")
class TestOrders:
    @allure.title("Customer places a Cash-on-Delivery order end-to-end")
    @pytest.mark.asyncio
    async def test_place_order(self, page):
        await page.goto(BASE_URL, wait_until="networkidle")
        await page.evaluate("document.getElementById('order')?.scrollIntoView()")
        await asyncio.sleep(0.6)
        await snap(page, "06_order_form_empty")
        await page.fill("#full_name", "E2E Tester")
        await page.fill("#phone_number", "+15551234567")
        await page.fill("#email", "e2e@example.com")
        await page.fill("#shipping_address", "123 Playwright Ave, Test City, TC 90210")
        await snap(page, "07_order_form_filled")
        await page.click("button[type=submit]")
        await expect(page.get_by_text("Thank you!")).to_be_visible(timeout=15000)
        await snap(page, "08_order_success")


@allure.epic("PawComfort Admin")
@allure.feature("Authentication")
class TestAuth:
    @allure.title("Admin sign-in with valid credentials")
    @pytest.mark.asyncio
    async def test_admin_login(self, page):
        await page.goto(f"{BASE_URL}/auth", wait_until="networkidle")
        await snap(page, "09_auth_page")
        await page.fill("#email", ADMIN_EMAIL)
        await page.fill("#password", ADMIN_PASS)
        await page.click("button[type=submit]")
        await page.wait_for_url("**/admin", timeout=15000)
        await page.wait_for_load_state("networkidle")
        await snap(page, "10_admin_dashboard_orders")


@allure.epic("PawComfort Admin")
@allure.feature("Dashboard")
class TestAdminDashboard:
    async def _login(self, page):
        await page.goto(f"{BASE_URL}/auth", wait_until="networkidle")
        await page.fill("#email", ADMIN_EMAIL)
        await page.fill("#password", ADMIN_PASS)
        await page.click("button[type=submit]")
        await page.wait_for_url("**/admin", timeout=15000)
        await page.wait_for_load_state("networkidle")
        await asyncio.sleep(1)

    @allure.title("Orders panel lists customer orders")
    @pytest.mark.asyncio
    async def test_orders(self, page):
        await self._login(page)
        await page.click('[data-testid=tab-orders]')
        await asyncio.sleep(0.8)
        await snap(page, "11_admin_orders")

    @allure.title("Reviews (testimonials) moderation panel")
    @pytest.mark.asyncio
    async def test_testimonials(self, page):
        await self._login(page)
        await page.click('[data-testid=tab-testimonials]')
        await asyncio.sleep(0.8)
        await snap(page, "12_admin_reviews")

    @allure.title("Products management panel")
    @pytest.mark.asyncio
    async def test_products(self, page):
        await self._login(page)
        await page.click('[data-testid=tab-products]')
        await asyncio.sleep(0.8)
        await snap(page, "13_admin_products")

    @allure.title("Store settings panel")
    @pytest.mark.asyncio
    async def test_settings(self, page):
        await self._login(page)
        await page.click('[data-testid=tab-settings]')
        await asyncio.sleep(0.8)
        await snap(page, "14_admin_settings")


@allure.epic("PawComfort Admin")
@allure.feature("Security")
class TestSecurity:
    @allure.title("Admin route redirects unauthenticated user to /auth")
    @pytest.mark.asyncio
    async def test_admin_guard(self, page):
        ctx = page.context
        await ctx.clear_cookies()
        await page.goto(BASE_URL)
        await page.evaluate("localStorage.clear()")
        await page.goto(f"{BASE_URL}/admin", wait_until="networkidle")
        await asyncio.sleep(1)
        assert "/auth" in page.url, f"Expected redirect to /auth, got {page.url}"
        await snap(page, "15_auth_guard_redirect")
