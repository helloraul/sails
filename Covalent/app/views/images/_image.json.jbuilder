json.extract! image, :id, :title, :center, :scale, :extent, :url, :description, :created_at, :updated_at
json.url image_url(image, format: :json)
