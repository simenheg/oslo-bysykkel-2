import Vue from 'vue';
import { mount, shallowMount } from '@vue/test-utils';

import App from '@/App.vue';
import Station from '@/components/Station.vue';

/*
 * Mock the browser's fetch API.
 */
global.fetch = require('jest-fetch-mock');

/*
 * Mock stations.
 */
const stations = [{
    station_id: "1101",
    name: "Stortingstunellen",
    address: "Rådhusgata 34",
    lat: 59.91065301806209,
    lon: 10.737365277561025,
    capacity: 24,
}, {
    station_id: "1023",
    name: "Professor Aschehougs plass",
    address: "Professor Aschehougs plass",
    lat: 59.9147672,
    lon: 10.740971,
    capacity: 12,
}];

/*
 * Mock station statuses.
 */
const status = [{
    station_id: "1101",
    is_installed: 1,
    is_renting: 1,
    is_returning: 1,
    last_reported: 1573986933,
    num_bikes_available: 7,
    num_docks_available: 13,
}, {
    station_id: "1023",
    is_installed: 1,
    is_renting: 1,
    is_returning: 1,
    last_reported: 1573986933,
    num_bikes_available: 3,
    num_docks_available: 0,
}];

describe('App.vue', () => {
    it('renders list of fetched stations', async () => {
        fetch.once(JSON.stringify({ data: { stations }}))
             .once(JSON.stringify({ data: { stations: status }}));

        const wrapper = mount(App);
        await Vue.nextTick();  // Await station fetch
        expect(wrapper.findAll('.station').length).toBe(2);
        stations.forEach(station => {
            expect(wrapper.text()).toMatch(station.name);
        });
    });
});

describe('App.vue', () => {
    it('renders error message on station fetch fail', async () => {
        fetch.mockReject(new Error());

        const wrapper = mount(App);
        await Vue.nextTick();  // Await station fetch
        expect(wrapper.findAll('.station').length).toBe(0);
        expect(wrapper.text()).toMatch('Feil ved henting av stasjoner');
    });
});

describe('App.vue', () => {
    it('renders list of fetched station statuses', async () => {
        fetch.once(JSON.stringify({ data: { stations }}))
             .once(JSON.stringify({ data: { stations: status }}));

        const wrapper = mount(App);
        await Vue.nextTick();  // Await station fetch
        await Vue.nextTick();  // Await status fetch
        expect(wrapper.findAll('.status').length).toBe(2);
        status.forEach(s => {
            expect(wrapper.text()).toMatch(
                `🚲 ${s.num_bikes_available} 🔒 ${s.num_docks_available}`
            );
        });
    });
});

describe('App.vue', () => {
    it('renders error message on status fetch fail', async () => {
        fetch.once(JSON.stringify({ data: { stations }}))
             .mockReject(new Error());

        const wrapper = mount(App);
        await Vue.nextTick();  // Await station fetch
        await Vue.nextTick();  // Await status fetch
        expect(wrapper.text()).toMatch('Feil ved sjekking av tilgjengelighet');
    });
});

describe('Station.vue', () => {
    it('renders its name when passed', () => {
        const station = {
            name: 'Colosseum Kino',
            status: {},
        };
        const wrapper = shallowMount(Station, {
            propsData: { station },
        });
        expect(wrapper.text()).toMatch(station.name);
    });
});

describe('Station.vue', () => {
    it('renders number of available bikes when passed', () => {
        const station = {
            status: {
                num_bikes_available: 5,
            },
        };
        const wrapper = shallowMount(Station, {
            propsData: { station },
        });
        const toMatch = `🚲 ${station.status.num_bikes_available}`;
        expect(wrapper.text()).toMatch(toMatch);
    });
});

describe('Station.vue', () => {
    it('renders number of available docks when passed', () => {
        const station = {
            status: {
                num_docks_available: 7,
            },
        };
        const wrapper = shallowMount(Station, {
            propsData: { station },
        });
        const toMatch = `🔒 ${station.status.num_docks_available}`;
        expect(wrapper.text()).toMatch(toMatch);
    });
});
