import {create} from 'zustand';
import {Index} from '@/states/fetched/index';
import {deepEqual} from 'fast-equals';

export type PopulatedDefaultProviders = Record<string, string>;

interface useProvidersState {
  populatedDefaultProviders: PopulatedDefaultProviders;
}

interface useProvidersActions {
  populate: (
    index: Index,
    defaultProviders: Record<string, string>,
    providersOrder: string[],
  ) => PopulatedDefaultProviders;
}

export type useProvidersProps = useProvidersState & useProvidersActions;

export const useProviders = create<useProvidersProps>(set => ({
  populatedDefaultProviders: {},
  populate: (index, defaultProviders, providersOrder) => {
    const newDefaultProviders: PopulatedDefaultProviders = {};
    for (const app in index) {
      if (app in defaultProviders) {
        newDefaultProviders[app] = defaultProviders[app];
      } else {
        const appProviders = Object.keys(index[app].providers);
        newDefaultProviders[app] =
          providersOrder.find(provider => appProviders.includes(provider)) ??
          appProviders[0];
      }
    }
    set(prev => {
      return deepEqual(prev.populatedDefaultProviders, newDefaultProviders)
        ? prev
        : {populatedDefaultProviders: newDefaultProviders};
    });
    return newDefaultProviders;
  },
}));
