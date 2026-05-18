import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Change this to your actual URL when testing against AKS
# For local testing use: http://localhost:3000
APP_URL = "http://85.211.226.203/"

@pytest.fixture
def driver():
    """Setup Chrome browser for each test"""
    options = Options()

    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1280,800")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.implicitly_wait(10)

    yield driver  # Give driver to each test

    driver.quit()  # Close browser after each test


class TestTaskManagerApp:

    # ── Test 1: Homepage loads correctly ─────────────────────────────
    def test_homepage_loads(self, driver):
        """Verify the homepage loads with correct title and heading"""
        driver.get(APP_URL)
        time.sleep(2)

        # Check page title
        assert "Task Manager" in driver.title or driver.title != "", \
            f"Page title is empty, got: {driver.title}"

        # Check main heading exists
        heading = driver.find_element(By.TAG_NAME, "h1")
        assert "Task Manager" in heading.text, \
            f"Heading not found, got: {heading.text}"

        # Check form is visible
        task_input = driver.find_element(By.ID, "task-input")
        assert task_input.is_displayed(), "Task input field is not visible"

        print(" Test 1 PASSED: Homepage loaded correctly")

    # ── Test 2: Add a new task ────────────────────────────────────────
    def test_add_task(self, driver):
        """Verify that adding a task works and appears in the list"""
        driver.get(APP_URL)
        time.sleep(2)

        # Find input field and type a task
        task_input = driver.find_element(By.ID, "task-input")
        task_title = "Selenium Test Task " + str(int(time.time()))
        task_input.clear()
        task_input.send_keys(task_title)

        # Select priority
        priority_select = driver.find_element(By.ID, "priority-select")
        priority_select.send_keys("High")

        # Click Add Task button
        add_btn = driver.find_element(By.ID, "add-btn")
        add_btn.click()

        # Wait for task to appear in list
        time.sleep(2)

        # Verify task appears in the page
        page_source = driver.page_source
        assert task_title in page_source, \
            f"Task '{task_title}' was not found in the page after adding"

        print(f" Test 2 PASSED: Task '{task_title}' added successfully")

    # ── Test 3: Form validation — empty task ─────────────────────────
    def test_empty_task_not_added(self, driver):
        """Verify that submitting empty task does not add anything"""
        driver.get(APP_URL)
        time.sleep(2)

        # Get current number of tasks
        task_items_before = driver.find_elements(By.CSS_SELECTOR, "[data-testid='task-item']")
        count_before = len(task_items_before)

        # Try to add empty task
        task_input = driver.find_element(By.ID, "task-input")
        task_input.clear()  # Make sure it's empty

        add_btn = driver.find_element(By.ID, "add-btn")
        add_btn.click()
        time.sleep(1)

        # Count tasks after — should be same
        task_items_after = driver.find_elements(By.CSS_SELECTOR, "[data-testid='task-item']")
        count_after = len(task_items_after)

        assert count_after == count_before, \
            f"Empty task was added! Before: {count_before}, After: {count_after}"

        print(" Test 3 PASSED: Empty task correctly rejected")

    # ── Test 4: Filter buttons work ───────────────────────────────────
    def test_filter_buttons(self, driver):
        """Verify All, Pending, Done filter buttons are present and clickable"""
        driver.get(APP_URL)
        time.sleep(2)

        # Find all filter buttons
        filter_buttons = driver.find_elements(By.CSS_SELECTOR, ".filter-btn")
        assert len(filter_buttons) >= 3, \
            f"Expected at least 3 filter buttons, found {len(filter_buttons)}"

        # Click each filter button
        for btn in filter_buttons:
            btn.click()
            time.sleep(0.5)
            assert "active" in btn.get_attribute("class"), \
                f"Filter button '{btn.text}' did not become active after click"

        print(" Test 4 PASSED: All filter buttons work correctly")

    # ── Test 5: Stats section shows numbers ──────────────────────────
    def test_stats_displayed(self, driver):
        """Verify stats cards (Total, Pending, Completed) are displayed"""
        driver.get(APP_URL)
        time.sleep(2)

        stat_cards = driver.find_elements(By.CSS_SELECTOR, ".stat-card")
        assert len(stat_cards) == 3, \
            f"Expected 3 stat cards, found {len(stat_cards)}"

        # Each stat card should have a number
        for card in stat_cards:
            num = card.find_element(By.CSS_SELECTOR, ".stat-num")
            assert num.text.isdigit(), \
                f"Stat number is not a digit: {num.text}"

        print(" Test 5 PASSED: Stats section displays correctly")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])