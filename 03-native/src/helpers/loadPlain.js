const loadPlain = async endpoint => {
  const request = await fetch(endpoint);
  return await request.text();
};

export default loadPlain;
