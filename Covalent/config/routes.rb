Rails.application.routes.draw do
  resources :images
  resources :pictures
  resources :points
  resources :articles
  resources :mpos
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
