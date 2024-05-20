const mockResponse = {
  event_id: 4,
  event_title: "test1",
  event_description: "test1",
  event_image: "e4386a2ae8a9cd78697d55fabf0e0435",
  event_room: "test1",
  event_date: "2024-04-29T13:20:00.000Z",
  event_quotas: 50,
  president_id: 1,
};

export default {
  get: jest.fn().mockResolvedValue(mockResponse),
};
