const calculateEuclideanDistance = (vector1, vector2) => {
  if (vector1.length !== vector2.length) {
    throw new Error("Los vectores deben tener la misma longitud");
  }

  let sum = 0;
  for (let i = 0; i < vector1.length; i++) {
    sum += Math.pow(vector1[i] - vector2[i], 2);
  }
  return Math.sqrt(sum);
};

export const compareBiometricVectors = (userVectors, detectedVectors) => {
  const distance = calculateEuclideanDistance(userVectors, detectedVectors);
  const threshold = 0.6;
  return distance < threshold;
};
