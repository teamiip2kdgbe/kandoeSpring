package be.kdg.kandoe.frontend;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ITPlayGame {

    WebDriver driver;
    WebElement element;

    @Before
    public void setupTest() {
        driver = new ChromeDriver();
    }

    @After
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testPlayGame() throws InterruptedException {
        driver.get("http://localhost:9966/Kandoe");
        driver.manage().window().maximize();
        login("ArneLauryssens", "test123");
        element = driver.findElement(By.xpath(".//*[@id='sort-list']/div[1]/div/div/button"));
        element.click();
        (new WebDriverWait(driver, 10)).until(ExpectedConditions.visibilityOfElementLocated(By.id("name")));
        element = driver.findElement(By.id("name"));
        sendKeysPerCharacter("Selenium session");
        Select dropdown = new Select(driver.findElement(By.xpath("html/body/my-kandoe/add-session/div/form/div[2]/select")));
        dropdown.selectByIndex(1);
        dropdown = new Select(driver.findElement(By.xpath("html/body/my-kandoe/add-session/div/form/div[3]/select")));
        dropdown.selectByVisibleText("SYNC");
        dropdown = new Select(driver.findElement(By.xpath("html/body/my-kandoe/add-session/div/form/div[4]/select")));
        dropdown.selectByIndex(0);
        element = driver.findElement(By.id("minCards"));
        element.sendKeys("2");
        element = driver.findElement(By.id("maxCards"));
        element.sendKeys("4");
        element = driver.findElement(By.xpath("html/body/my-kandoe/add-session/div/form/div[9]/div[1]/input[1]"));
        sendKeysPerCharacter("2016");
        element = driver.findElement(By.xpath("html/body/my-kandoe/add-session/div/form/div[9]/div[1]/input[2]"));
        element.sendKeys("3");
        element = driver.findElement(By.xpath("html/body/my-kandoe/add-session/div/form/div[9]/div[1]/input[3]"));
        sendKeysPerCharacter("18");
        element = driver.findElement(By.xpath("html/body/my-kandoe/add-session/div/form/div[9]/div[2]/input[1]"));
        sendKeysPerCharacter("2016");
        element = driver.findElement(By.xpath("html/body/my-kandoe/add-session/div/form/div[9]/div[2]/input[2]"));
        sendKeysPerCharacter("4");
        element = driver.findElement(By.xpath("html/body/my-kandoe/add-session/div/form/div[9]/div[2]/input[3]"));
        sendKeysPerCharacter("10");
        element = driver.findElement(By.id("size-circle"));
        sendKeysPerCharacter("5");
        element = driver.findElement(By.xpath("html/body/my-kandoe/add-session/div/form/div[11]/label/input"));
        element.click();
        element = driver.findElement(By.xpath("html/body/my-kandoe/add-session/div/form/button"));
        element.click();

        goToSession();
        (new WebDriverWait(driver, 10)).until(ExpectedConditions.visibilityOfElementLocated(By.id("name")));
        element = driver.findElement(By.id("name"));
        sendKeysPerCharacter("Selenium add card to session");
        element = driver.findElement(By.xpath("html/body/my-kandoe/session-detail/div[3]/div[1]/div/div[2]/div/div/div/button"));
        element.click();
        (new WebDriverWait(driver, 10)).until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("html/body/my-kandoe/session-detail/div[3]/div[1]/div/div[1]/ul/li[1]/div/div[3]/input")));
        element = driver.findElement(By.xpath("html/body/my-kandoe/session-detail/div[3]/div[1]/div/div[1]/ul/li[1]/div/div[3]/input"));
        JavascriptExecutor js = (JavascriptExecutor)driver;
        js.executeScript("arguments[0].click();", element);
        element = driver.findElement(By.xpath("html/body/my-kandoe/session-detail/div[3]/div[1]/div/div[1]/ul/li[2]/div/div[3]/input"));
        js.executeScript("arguments[0].click();", element);
        element = driver.findElement(By.xpath("html/body/my-kandoe/session-detail/div[3]/div[1]/div/div[1]/ul/li[3]/div/div[3]/input"));
        js.executeScript("arguments[0].click();", element);
        element = driver.findElement(By.xpath("html/body/my-kandoe/session-detail/div[3]/div[2]/div/button"));
        element.click();
        logout();

        login("SenneWens", "test123");
        goToSession();
        (new WebDriverWait(driver, 10)).until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("html/body/my-kandoe/session-detail/div[3]/div[1]/div/div[1]/ul/li[1]/div/div[3]/input")));
        element = driver.findElement(By.xpath("html/body/my-kandoe/session-detail/div[3]/div[1]/div/div[1]/ul/li[1]/div/div[3]/input"));
        js.executeScript("arguments[0].click();", element);
        element = driver.findElement(By.xpath("html/body/my-kandoe/session-detail/div[3]/div[1]/div/div[1]/ul/li[2]/div/div[3]/input"));
        js.executeScript("arguments[0].click();", element);
        element = driver.findElement(By.xpath("html/body/my-kandoe/session-detail/div[3]/div[1]/div/div[1]/ul/li[4]/div/div[3]/input"));
        js.executeScript("arguments[0].click();", element);
        element = driver.findElement(By.xpath("html/body/my-kandoe/session-detail/div[3]/div[2]/div/button"));
        element.click();
        logout();

        login("ArneLauryssens", "test123");
        goToSession();
        pushCard("1");
        chat("hallo senne");
        logout();

        login("SenneWens", "test123");
        goToSession();
        chat("hallo arne");
        pushCard("2");
        logout();

        login("ArneLauryssens", "test123");
        goToSession();
        pushCard("1");
        pushCard("1");
        logout();

        login("SenneWens", "test123");
        goToSession();
        pushCard("2");
        logout();

        login("ArneLauryssens", "test123");
        goToSession();
        pushCard("1");
        logout();

        login("SenneWens", "test123");
        goToSession();
        pushCard("1");

        Thread.sleep(3000);
    }

    private void login(String username, String password){
        (new WebDriverWait(driver, 10)).until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(".//*[@id='myNavbar']/div/ul/li[1]/a")));
        element = driver.findElement(By.xpath(".//*[@id='myNavbar']/div/ul/li[1]/a"));
        element.click();
        element = driver.findElement(By.id("username"));
        sendKeysPerCharacter(username);
        element = driver.findElement(By.id("password"));
        sendKeysPerCharacter(password);
        element = driver.findElement(By.xpath("./*//*[@id='login-form']/div/button"));
        element.click();
        (new WebDriverWait(driver, 10)).until((WebDriver d) -> d.findElement(By.tagName("loggedin-home")) != null);
    }

    private void logout(){
        element = driver.findElement(By.xpath(".//*[@id='myNavbar']/ul[2]/li[2]/a"));
        element.click();
        (new WebDriverWait(driver, 10)).until(
                ExpectedConditions.visibilityOfElementLocated(By.xpath(".//*[@id='myNavbar']/ul[2]/li[2]/ul/li[3]/a")));
        element = driver.findElement(By.xpath(".//*[@id='myNavbar']/ul[2]/li[2]/ul/li[3]/a"));
        element.click();
    }

    private void goToSession() {
        (new WebDriverWait(driver, 10)).until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(".//*[@id='sort-list']/div[4]/div/div[3]/div/div[3]/button")));
        element = driver.findElement(By.xpath(".//*[@id='sort-list']/div[4]/div/div[3]/div/div[3]/button"));
        element.click();
    }

    private void pushCard(String id){
        (new WebDriverWait(driver, 10)).until(ExpectedConditions.visibilityOfElementLocated(By.id(id)));
        element = driver.findElement(By.id(id));
        element.click();
    }

    private void chat(String message){
        (new WebDriverWait(driver, 10)).until(ExpectedConditions.visibilityOfElementLocated(By.id("sendchatmessage")));
        element = driver.findElement(By.id("sendchatmessage"));
        sendKeysPerCharacter(message);
        element = driver.findElement(By.xpath(".//*[@id='chat-open']/div[2]/button"));
        element.click();
    }

    private void sendKeysPerCharacter(String keys) {
        for(int i = 0; i < keys.length(); i++){
            element.sendKeys("" + keys.charAt(i));
        }
    }
}
