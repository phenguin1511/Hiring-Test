// // LAB 0-1 LOGIN TEST
// async function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
// // 
// async function processWithDelay(numbers: number[]): Promise<void> {
//   if (!Array.isArray(numbers)) {
//     throw new Error("Input must be an array");
//   }
//   if (numbers.length === 0) {
//     return new Promise((resolve) => resolve());
//   }

//   for (const number of numbers) {
//     if (typeof number !== 'number') {
//       throw new Error("Array must contain only numbers");
//     }
//     await delay(1000);
//     console.log(number);
//   }
//   return new Promise((resolve) => resolve());

// }

// processWithDelay([1, 2, 3, 4, 5])

//--------------------------HOW TO RUN---------------------------//

Step 1: npm install
Step 2: npm run dev

