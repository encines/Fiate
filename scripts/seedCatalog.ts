import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rawCars = `
1. Nissan Versa
2. Chevrolet Aveo
3. Nissan NP300
4. Kia K3 Sedán
5. Nissan March
6. Mazda CX-30
7. Nissan Kicks
8. Volkswagen Virtus
9. Nissan Sentra
10. Hyundai Creta
11. Mazda 2 Sedán
12. Volkswagen Taos
13. MG 5
14. Chevrolet S10
15. Volkswagen Jetta
16. Toyota Hilux
17. Volkswagen Tiguan
18. Nissan Magnite
19. Chevrolet Tornado Van
20. Renault Kwid
21. Chevrolet Groove
22. RAM 700
23. Chevrolet Captiva
24. Nissan X-Trail
25. Kia Seltos
26. Toyota RAV4
27. Mazda 3 Sedán
28. Volkswagen Saveiro
29. Mazda CX-5
30. Ford Territory
31. Kia K4 Sedán
32. Kia Sonet
33. Suzuki Swift
34. RAM 1200
35. Mitsubishi L200
36. Hyundai Grand i10
37. Geely Emgrand
38. Toyota Avanza
39. Chevrolet Onix*
40. Toyota Yaris Sedán
41. Hyundai Grand i10 Sedán
42. Honda CR-V
43. Toyota Tacoma
44. Volkswagen Taigun
45. MG 3*
46. Honda HR-V
47. Toyota Corolla
48. Kia K3 Hatchback
49. SEAT Ibiza
50. JAC Frison
51. Nissan Urvan*
52. Toyota Raize
53. Suzuki Jimny
54. Toyota Sienna
55. Mazda CX-3
56. Mitsubishi Outlander Sport
57. Kia Sportage*
58. Dodge Attitude
59. Haval Jolion
60. Toyota Corolla Cross
61. Ford Ranger
62. Chevrolet Tracker
63. Chevrolet Trax
64. Toyota Highlander
65. Dodge Journey*
66. Honda BR-V
67. Volkswagen Polo
68. Honda City
69. Suzuki Ertiga
70. Volkswagen Teramont
71. Ford F-150
72. Toyota Prius
73. Chevrolet Silverado*
74. Hyundai Tucson
75. Mazda 3 Hatchback
76. Mazda 2 Hatchback
77. Changan CS55*
78. Mitsubishi Xpander
79. Ford Transit
80. MG One
81. Peugeot Partner
82. Suzuki Fronx
83. MG RX5
84. GWM Poer
85. Honda Civic
86. Toyota Camry
87. Peugeot Rifter
88. Changan Alsvin*
89. Peugeot 2008
90. Jeep Compass
91. Chevrolet Cheyenne*
92. Ford Lobo*
93. Chevrolet Montana
94. SEAT / CUPRA León
95. Ford Explorer
96. Suzuki Ignis
97. Volkswagen Tera
98. Peugeot Partner Rapid
99. GMC Sierra*
100. Geely Coolray
101. Jeep Renegade
102. CUPRA Formentor
103. Volvo EX30
104. Changan CS35 Plus*
105. Jeep Wrangler
106. Mazda CX-90
107. RAM 1500
108. Fiat Pulse
109. Ford Maverick
110. JAC 8
111. Haval H6
112. Mazda CX-50
113. JAC 4
114. JAC 2
115. Renault Oroch
116. Chevrolet Suburban
117. Mercedes-Benz Sprinter
118. MG GT
119. Volkswagen Crafter Chasis
120. BMW X3
121. Toyota Hiace*
122. Ford F-350
123. SEAT Arona
124. Renault Arkana
125. Volkswagen Nivus
126. Ford Bronco Sport
127. Jeep Commander
128. Jeep Grand Cherokee
129. BMW X1
130. MG ZS*
131. Hyundai HB20 Sedán
132. Changan New Star Truck
133. Mitsubishi Mirage G4
134. Renault Kardian
135. Buick Envista
136. Mercedes-Benz GLC
137. Ford Escape*
138. Geely EX5
139. Changan Honor S
140. JAC Sunray
141. Chevrolet Colorado
142. Suzuki Baleno
143. Volkswagen Amarok
144. Toyota Yaris Hatchback
145. Chevrolet Tahoe
146. MG HS*
147. Renault Duster
148. Audi A3
149. Subaru Crosstrek MHEV
150. GMC Terrain
151. Subaru Forester
152. Audi Q5
153. RAM DS
154. Renault Kangoo
155. Geely Cityray
156. CUPRA Terramar
157. Changan EADO Plus
158. Mercedes-Benz GLE
159. Kia Sorento
160. Volkswagen Transporter*
161. Honda Pilot
162. RAM 4000
163. Changan Hunter*
164. Chirey Tiggo 2
165. GMC Canyon Crew Cab 4x4
166. BMW X5
167. MINI Cooper 3 puertas
168. Chevrolet Traverse
169. Jeep JT
170. BMW Serie 2
171. Volkswagen Caddy
172. Toyota 4Runner
173. Volkswagen Golf GTI
174. GMC Yukon*
175. Honda Odyssey
176. Suzuki Dzire
177. Cadillac Escalade ESV
178. Nissan Frontier V6
179. BMW X6
180. Peugeot 3008
181. Renault Koleos (nueva generación)
182. Peugeot Manager HDi
183. Volvo XC60
184. Mazda MX-5
185. JAC X350
186. Jetour T2*
187. Audi Q3 Sportback
188. Geely Starray
189. Chevrolet Spark EUV
190. Mazda BT-50
191. BMW X2
192. SEAT Ateca
193. Suzuki Grand Vitara
194. GMC Acadia
195. Lincoln Nautilus
196. Isuzu ELF 300
197. Ford Bronco
198. Fiat Fastback
199. Lexus NX
200. Ford F-450
201. Porsche Cayenne
202. Fiat Argo
203. Omoda O5
204. Kia Niro
205. Geely GX3 Pro
206. BMW X4
207. MINI Countryman
208. Ford Expedition
209. GWM Tank 300
210. Omoda C5
211. Ford F-550
212. Mitsubishi Outlander PHEV
213. Renault Logan
214. Audi Q3
215. Ford Mustang
216. Geely Monjaro
217. Ford F-250
218. Foton Tunland
219. Porsche 911
220. BMW Serie 3
221. Honda Accord
222. BMW Serie 1
223. Hyundai Santa Fe
224. Chevrolet Express Max
225. Kia K4 Hatchback
226. Toyota Tundra
227. Range Rover Sport
228. Porsche Macan
229. Changan UNI-K*
230. BMW Serie 4
231. Peugeot Expert Cargo Van
232. Changan CS75
233. Chirey Tiggo 4
234. Nissan Pathfinder
235. Audi A1
236. Isuzu ELF 100
237. Volvo XC40
238. Buick Enclave
239. Renault Master
240. Foton TM 3
241. Chirey Tiggo 7
242. Audi Q2
243. Lexus RX
244. Buick Envision
245. JAC 6
246. Fiat Mobi
247. Toyota Sequoia
248. Audi A5 Sportback
249. Changan Deepal S07 REEV
250. Isuzu ELF 200
251. Hyundai Elantra
252. Hyundai HB20 Hatchback
253. MINI Cooper 5 puertas
254. Mercedes-Benz GLB
255. Volvo XC90
256. JAC X200
257. JAC E10X
258. Land Rover Defender
259. Mazda CX-70
260. Renault Stepway
261. Audi Q8
262. Renault Koleos
263. Mercedes-Benz GLA
264. Mercedes-Benz CLA
265. Chirey Tiggo 8
266. Chevrolet Blazer
267. Buick Encore
268. Jetour Dashing
269. Audi Q7*
270. Suzuki S-Cross
271. Lincoln Navigator
272. Infiniti QX60
273. JAC Sei2
274. Lexus UX
275. Foton View
276. Renault Kwid E-TECH
277. Lincoln Corsair
278. MG RX8
279. Mercedes-Benz Clase C
280. Ford E-Transit
281. Dodge Durango
282. BMW X7
283. BAIC X35
284. Peugeot E-Partner
285. Porsche 718 Cayman
286. Range Rover Evoque
287. JMC Grand Avenue
288. Mercedes-Benz Clase G
289. JMC Vigus
290. Jetour T1*
291. Kia Telluride
292. GWM Ora 03
293. Ford Edge
294. Toyota GR Yaris
295. MG 7
296. MG 4
297. Hyundai Palisade
298. Isuzu ELF 350
299. Volvo C40
300. MINI Aceman
301. MINI Cooper Electric
302. Mercedes-Benz Clase E
303. BAIC U5
304. Mercedes-Benz GLS
305. GWM Tank 500
306. MG RX9
307. Mercedes-Benz Clase A Sedán
308. Chevrolet Express*
309. Infiniti QX50
310. BMW iX1
311. BMW iX2
312. Infiniti QX80
313. JAC J7
314. RAM Promaster
315. Jetour X70
316. Subaru WRX
317. Foton S3
318. MG IM LS7
319. Acura RDX
320. Chevrolet Cavalier
321. Mercedes-Benz Clase A Hatchback
322. Infiniti QX55
323. Lexus TX
324. Mercedes-Benz CLE
325. Lexus GX
326. Audi A5
327. JAC Sunray City
328. Acura MDX
329. Subaru BRZ
330. Lexus LX
331. JAC EX450
332. Chevrolet Equinox EV
333. BAIC X55
334. Volkswagen e-Crafter
335. Soueast S07
336. MINI Convertible
337. Jeep Wagoneer
338. Geely Okavango
339. Alfa Romeo Tonale
340. Lincoln Aviator*
341. Cadillac XT4
342. Soueast S06 i-DM
343. Peugeot Landtrek
344. Peugeot 5008
345. Jaecoo 7
346. Dodge Attitude 
347. JAC E30X
348. BMW iX
349. Mitsubishi Montero Sport
350. DFSK E5
351. Acura ADX
352. JAC Traveler
353. Jetour X70 Plus
354. BMW Serie 5
355. MINI Countryman E
356. Range Rover
357. Lexus ES
358. Porsche 718 Boxster
359. Audi Q6 e-tron
360. Chirey Arrizo 8
361. Ford Mustang Mach-E
362. Audi A6
363. Mercedes-Benz EQE SUV
364. Range Rover Velar
365. BMW i4
366. DFSK 600
367. MG ZS EV
368. Mercedes-Benz Vito
369. Changan Deepal S07 BEV
370. Foton HI-VAN
371. Changan CS95
372. BMW Z4
373. Dodge Charger
374. Subaru Outback
375. Chirey Tiggo 7 Pro e+
376. Kia EV6
377. JAC Sei7 Pro
378. GMC Hummer EV SUV
379. BMW i5
380. Cadillac Optiq
381. GMC Hummer EV Pick-up
382. Chevrolet Blazer EV
383. Chevrolet Corvette
384. Acura Integra
385. Soueast S09
386. JAC Sei4 Pro
387. Geely E22H
388. Volvo EX90
389. Volkswagen ID.4
390. MG Cyberster
391. Cadillac XT5
392. Audi A4
393. Alfa Romeo Stelvio
394. JAC E J7
395. BMW XM
396. JAC e-SEI 4 Pro
397. Chirey Tiggo 8 Pro e+
398. Land Rover Discovery Sport
399. Porsche Panamera
400. JAC E Frison T8
401. Mercedes-Benz EQB
402. Geely Geometry C
403. Cadillac Lyriq
404. Porsche Taycan
405. Mercedes-Benz SL
406. Audi A5 Coupé
407. DFSK 500
408. Alfa Romeo Giulia
409. Mercedes-Benz EQS SUV
410. Suzuki Ciaz
411. BMW Serie 7
412. BAIC EU5
413. Mercedes-Benz Clase S
414. Toyota Supra
415. BMW iX3
416. Foton S3 EV
417. DFSK EC35
418. Mercedes-Benz EQA
419. Audi A7
420. Renault Mégane E-TECH
421. Hyundai Ioniq 5
422. Nissan Z
423. Kia Forte
424. Mercedes-AMG GT
425. Lexus IS
426. JAC Sei6 Pro
427. Renault Master E-TECH
428. Acura TLX
429. Kia Soul
430. Chevrolet Corvette Convertible
431. Mercedes-Benz EQE
432. BMW i7
433. Nissan Altima
434. Mercedes-Benz EQS
435. Foton Wonder EV
436. Seres 5 Max
437. Renault Kangoo Z.E.
438. BAIC BJ40
439. Auteco E-Van S1.0T Pro
440. Lexus LC
441. JAC X250
442. JAC E Sunray
443. Auteco RICH 6 EV
444. Audi e-tron
445. Foton Miler
446. JAC E Sei 4
447. BMW Serie 8
448. Mercedes-Benz EQC
449. Bentley Continental
450. JMC EV-Black
451. Foton TM EV
452. General Motors Brightdrop
453. Audi A8
454. Jaguar F-Pace
455. Chevrolet Bolt EUV
456. Auteco D2S 150
457. MINI Clubman
458. Foton Tunland EV
459. Bentley Bentayga
460. Volkswagen T-Cross
461. Seres 5 EV
462. Kia Forte Hatchback
463. Fiat Ducato
464. Dodge Challenger
465. SEAT Tarraco
466. Peugeot 301
467. Auteco E-Truck B2.0T
468. Auteco D2S 250
469. Nissan GT-R
470. Lexus LS
471. JAC E X350
472. Foton Hi Van EV
473. Chevrolet Camaro
474. Bentley Flying Spur
475. Audi R8
`;

const standardPlan = [
  { name: "Cambio de aceite y filtro", km: 10000 },
  { name: "Rotación de llantas", km: 10000 },
  { name: "Filtro de aire del motor", km: 20000 },
  { name: "Filtro de aire de cabina", km: 20000 },
  { name: "Inspección de frenos", km: 20000 },
  { name: "Cambio de líquido de frenos", km: 40000 },
  { name: "Bujías de encendido", km: 50000 },
  { name: "Revisión de suspensión", km: 30000 },
  { name: "Cambio de refrigerante", km: 80000 },
];

async function seed() {
  console.log("Iniciando ingesta de 475 modelos...");
  
  const cars = rawCars
    .split("\n")
    .map(line => line.replace(/^\d+\.\s*/, "").trim())
    .filter(name => name.length > 0);

  for (const carName of cars) {
    const key = carName.toLowerCase();
    try {
      await prisma.maintenanceCatalog.upsert({
        where: { key },
        update: {
          tasksJson: JSON.stringify(standardPlan)
        },
        create: {
          key,
          tasksJson: JSON.stringify(standardPlan)
        }
      });
      process.stdout.write(".");
    } catch (e) {
      console.error(`\nError insertando ${carName}:`, e);
    }
  }

  console.log("\nIngesta completada exitosamente.");
}

seed()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
