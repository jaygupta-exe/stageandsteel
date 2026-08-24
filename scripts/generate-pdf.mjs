import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

async function generatePDF() {
  const executablePath = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  const htmlPath = path.resolve("StageAndSteel_Project_Proposal.html");
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

  const pdfPath = path.resolve("Stage_and_Steel_Project_Deliverables_and_Proposal.pdf");
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "12mm",
      bottom: "12mm",
      left: "12mm",
      right: "12mm",
    },
  });

  await browser.close();
  console.log(`PDF successfully generated at: ${pdfPath}`);
}

generatePDF().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
